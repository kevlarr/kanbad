Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'hello', to: 'hello#show'

  resources :workspace, only: [:create, :show]
end
