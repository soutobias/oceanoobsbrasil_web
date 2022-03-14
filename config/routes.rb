Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get "admin", to: "pages#admin"
  resources :stations
  get "graphs/:id", to: "stations#graphs"
end
