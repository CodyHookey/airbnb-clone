module Api
  class ChargesController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:mark_complete]

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)

      if !session
        return render json: {
          error: "User not logged in"
        }, status: :unauthorized
      end

      booking = Booking.find_by(id: params[:booking_id])

      if !booking
        return render json: {
          error: "Cannot find booking"
        }, status: :not_found
      end

      property = booking.property
      days_booked = (booking.end_date - booking.start_date).to_i
      amount = days_booked * property.price_per_night

      session = Stripe::Checkout::Session.create(
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            unit_amount: (amount * 100.0).to_i, #amount in cents
            product_data: {
              name: "Trip for #{property.title}",
              description: "Your booking is for #{booking.start_date} to #{booking.end_date}.",
            },
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: "#{ENV['URL']}/booking/#{booking.id}/success",
        cancel_url: "#{ENV['URL']}#{params[:cancel_url]}",
      )

      @charge = booking.charges.new({
        checkout_session_id: session.id,
        currency: 'usd',
        amount: amount
      })

      if @charge.save
        render 'api/charges/create', status: :created
      else
        render json: {
          error: "charge could not be created"
        }, status: :bad_request
      end
    end

    def retry
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)

      if !session
        return render json: {
          error: "User not logged in"
        }, status: :unauthorized
      end

      booking = Booking.find_by(id: params[:booking_id])

      if !booking
        return render json: {
          error: "Cannot find booking"
        }, status: :not_found
      end

      charge = booking.charges.find_by(complete: false)

      if !charge
        return render json: {
          error: "No failed charge found"
        }, status: :not_found
      end

      property = booking.property
      days_booked = (booking.end_date - booking.start_date).to_i
      amount = days_booked * property.price_per_night

      stripe_session = Stripe::Checkout::Session.create(
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            unit_amount: (amount * 100.0).to_i,
            product_data: {
              name: "Trip for #{property.title}",
              description: "Your booking is for #{booking.start_date} to #{booking.end_date}.",
            },
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: "#{ENV['URL']}/booking/#{booking.id}/success",
        cancel_url: "#{ENV['URL']}#{params[:cancel_url]}",
      )

      charge.update(checkout_session_id: stripe_session.id)

      render json: {
        id: stripe_session.id
      }, status: :ok
    end

    def mark_complete
      # You can find your endpoint's secret in your webhook settings
      endpoint_secret = ENV['STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET']

      event = nil

      # Verify webhook signature and extract the event
      # See https://stripe.com/docs/webhooks/signatures for more information.

      begin
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        payload = request.body.read
        event = Stripe::Webhook.construct_event(
          payload, sig_header, endpoint_secret
        )
      rescue JSON::ParserError => e
        # Invalid payload
        return head :bad_request
      rescue Stripe::SignatureVerificationError => e
        # Invalid signature
        return head :bad_request
      end

      # Handle the checkout.session.completed event
      if event['type'] == 'checkout.session.completed'
        session = event['data']['object']

        # Fulfil the purchase, mark related charge as complete
        charge = Charge.find_by(checkout_session_id: session.id)
        if !charge
          return head :bad_request
        end

        charge.update({ complete: true })

        return head :ok
      end

      return head :bad_request
    end

    def show
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)

      if !session
        return render json: {
          error: "User not logged in"
        }, status: :unauthorized
      end

      booking = Booking.find_by(id: params[:booking_id])

      if !booking
        return render json: {
          error: "Booking not found"
        }, status: :not_found
      end

      @charge = Charge.find_by(booking_id: params[:booking_id])

      if !@charge
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/charges/show', status: :ok
    end
  end
end