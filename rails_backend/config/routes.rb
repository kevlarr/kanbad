Rails.application.routes.draw do
  scope '/api' do
    get 'hello', to: 'hello#show'

    namespace :v1 do
      resources :workspace, only: [:create, :show]
    end
  end
end
