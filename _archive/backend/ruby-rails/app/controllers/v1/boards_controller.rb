class V1::BoardsController < ActionController::API
  before_action :find_workspace, only: [:create]
  before_action :find_board, only: [:show, :update, :destroy]

  def index
    render json: Board.for_workspace(params[:workspace])
  end

  def create
    board = Board.new(
      workspace: @workspace,
      identifier: SecureRandom.uuid,
      title: "New Board"
    )

    if board.save
      render json: board
    else
      render json: board.errors, status: 400
    end
  end

  def show
    render json: @board
  end

  def update
    @board.update board_params

    if @board.save
      render json: @board
    else
      render json: @board.errors, status: 400
    end
  end

  def destroy
    if @board.destroy
      render status: 204
    else
      render json: @board.errors, status: 400
    end
  end

  private

  def board_params
    params.permit(:title)
  end

  def find_workspace
    @workspace = Workspace.find_by identifier: params[:workspace]
  end

  def find_board
    @board = Board.find_by identifier: params[:id]
  end
end
