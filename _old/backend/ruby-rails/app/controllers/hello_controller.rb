class HelloController < ActionController::API
  def show
    render json: "hello, #{params[:name] || "world"}"
  end
end
