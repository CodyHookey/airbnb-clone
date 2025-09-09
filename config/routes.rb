Rails.application.routes.draw do
  # Static Pages
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/booking/:id/success' => 'static_pages#success'
  get '/my-properties' => 'static_pages#my_properties'
  get '/property/:id/bookings' => 'static_pages#property_bookings'
  get '/my-bookings/:id' => 'static_pages#my_bookings'
  get '/add-property' => 'static_pages#add_property'
  get '/property/edit/:id' => 'static_pages#edit_property'

  namespace :api do
    # Users
    post '/users' => 'users#create'
    get '/users/:id' => 'users#show'
    patch '/users/become-a-host/:id' => 'users#property_owner'

    # Sessions
    post '/sessions' => 'sessions#create'
    delete '/sessions/:id' => 'sessions#destroy'
    get '/authenticated' => 'sessions#authenticated'

    # Properties
    get '/properties' => 'properties#index'
    get '/properties/:id' => 'properties#show'
    get 'admin/properties' => 'properties#admin_index'
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    post '/properties' => 'properties#create'
    patch '/properties/:id' => 'properties#update'

    # Bookings
    post '/bookings' => 'bookings#create'
    get '/bookings/:id' => 'bookings#index_by_user'

    # Charges
    post '/charges/mark_complete' => 'charges#mark_complete'
    post '/charges/:booking_id/retry' => 'charges#retry'
    post '/charges' => 'charges#create'

    # Payment Status
    get '/payment-status/:booking_id' => 'charges#show'
  end
end
