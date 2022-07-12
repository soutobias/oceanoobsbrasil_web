Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get "admin", to: "pages#admin"
  get "en", to: "pages#en"
  resources :stations
  get "graphs/:id", to: "stations#graphs"
end
