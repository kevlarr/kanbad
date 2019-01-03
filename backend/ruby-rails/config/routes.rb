Rails.application.routes.draw do
  scope '/api' do
    get 'hello', to: 'hello#show'

    namespace :v1 do
      resources :workspaces, only: [:create, :show]
      resources :boards, only: [:index, :create, :show, :update, :destroy]
      resources :cards, only: [:index, :create, :show, :update, :destroy]
    end
  end
end
