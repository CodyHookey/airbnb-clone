module Api
  class PropertiesController < ApplicationController
    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)

      if !@properties
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])

      if !@property
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/properties/show', status: :ok
    end

    def create
      @property = current_user.properties.new(property_params)

      if @property.save
        render 'api/properties/create', status: :created
      else
        render json: {
          error: "Couldn't create Property"
        }, status: :unprocessable_entity
      end
    end

    def admin_index
      @properties = current_user.properties.order(created_at: :desc).page(params[:page]).per(6)

      if !@properties
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/properties/index', status: :ok
    end

    def update
      @property = Property.find_by(id: params[:id])

      if !@property
        return render json: {
          error: "Property not found"
        }, status: :not_found
      end

      if @property&.user_id != current_user&.id
        return render json: {
          error: "Unauthorized"
        }, status: :Unauthorized
      end

      if @property.update(property_params)
        render json: {
          success: true
        }, status: :ok
      else
        render json: {
          success: false
        }, status: :unprocessable_entity
      end
    end

    private

    def current_user
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      session&.user
    end

    def property_params
      params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, images: [])
    end
  end
end