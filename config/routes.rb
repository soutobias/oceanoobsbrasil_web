Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get "admin", to: "pages#admin"
  get "data", to: "pages#data"
  resources :stations
end
