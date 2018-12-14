Rails.application.routes.draw do
  scope '/api' do
    get 'hello', to: 'hello#show'

    namespace :v1 do
      resources :workspaces, only: [:create, :show]
      resources :boards, only: [:create, :show, :update, :destroy]
    end
  end
end
