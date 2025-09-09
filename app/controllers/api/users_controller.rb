module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def show
      @user = User.find_by(id: params[:id])

      if !@user
        return render json: {
          error: "not_found"
        }, status: :not_found
      end

      render 'api/users/show'
    end

    def property_owner
      @user = User.find_by(id: params[:id])

      if !@user
        return render json: {
          error: "User not found"
        }, status: :not_found
      end

      if @user.update(property_owner: true)
        render 'api/users/propertyOwner'
      else
        render json: {
          error: "Unable to Update User"
        }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end