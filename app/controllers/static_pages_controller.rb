class StaticPagesController < ApplicationController
  before_action :require_login, only: [:my_properties]

  def home
    render 'home'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end

  def property_bookings
    property = Property.find_by(id: params[:id])

    if property.user_id != current_user&.id
      redirect_to root_path
      return
    end

    @data = { property_id: params[:id] }.to_json
  end

  def login
    render 'login'
  end

  def success
    booking = Booking.find_by(id: params[:id])

    if booking.user_id != current_user&.id
      redirect_to root_path
      return
    end

    user = User.find_by(id: current_user&.id)

    if booking
      @data = {
        booking_id: booking.id,
        property_id: booking.property_id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        user_email: user.email,
        user_username: user.username,
      }.to_json
    else
      @data = {}.to_json
    end
  end

  def my_properties
    if !current_user&.property_owner
      redirect_to root_path
      return
    end
  end

  def add_property
    if !current_user&.property_owner
      redirect_to root_path
      return
    end
  end

  def edit_property
    @property = Property.find_by(id: params[:id])

    if !@property
      return render json: {
        error: "Property not found"
      }, status: :not_found
    end

    if @property&.user_id != current_user&.id
      return render json: {
        error: "Unauthorized access"
      }, status: :Unauthorized
    end

    @data = { property_id: params[:id] }.to_json
  end

  def my_bookings
    if !current_user
      redirect_to root_path
    end

    @data = { user_id: params[:id] }.to_json
  end

  private

  def require_login
    if !current_user
      redirect_to root_path
    end
  end

  def current_user
    token = cookies.signed[:airbnb_session_token]
    session = Session.find_by(token: token)
    session&.user
  end
end
