class V1::WorkspaceController < ActionController::API
  def create
    ws = Workspace.new identifier: SecureRandom.uuid
    ws.save()
    render json: ws
  end

  def show
    render json: Workspace.find_by(identifier: params[:id])
  end
end
