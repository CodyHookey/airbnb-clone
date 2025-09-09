module Api
  class BookingsController < ApplicationController
    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      
      if !session
        return render json: {
          error: "User not logged in"
        }, status: :unauthorized
      end

      property = Property.find_by(id: params[:booking][:property_id])

      if !property
        return render json: {
          error: "Cannot find property"
        }, status: :not_found
      end

      begin
        @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date] })
        render "api/bookings/create", status: :created
      rescue ArgumentError => e
        render json: {
          error: e.message
        }, status: :bad_request
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])

      if !property
        return render json: {
          error: "Cannot find property"
        }, status: :not_found
      end

      @bookings = property.bookings.where("end_date > ? ", Date.today)
      render 'api/bookings/index'
    end

    def index_by_user
      @bookings = current_user.bookings.order(created_at: :desc).page(params[:page]).per(25)

      if !@bookings
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/bookings/indexByUser', status: :ok
    end

    private

    def current_user
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      session&.user
    end

    def booking_params
      params.require(:booking).permit(:property_id, :start_date, :end_date)
    end
  end
end