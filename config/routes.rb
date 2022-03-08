Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get "admin", to: "pages#admin"
  get "br", to: "pages#data"
  resources :stations
  get "br/graphs/:id", to: "stations#graphs"
end
