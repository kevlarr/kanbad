class V1::CardsController < ActionController::API
  before_action :find_board, only: [:create]
  before_action :find_card, only: [:show, :update, :destroy]

  def create
    card = Card.new(
      board: @board,
      identifier: SecureRandom.uuid,
      title: "New Card"
    )

    if card.save
      render json: card
    else
      render json: card.errors, status: 400
    end
  end

  def show
    render json: @card
  end

  def update
    @card.update card_params

    if @card.save
      render json: @card
    else
      render json: @card.errors, status: 400
    end
  end

  def destroy
    if @card.destroy
      render status: 200
    else
      render json: @card.errors, status: 400
    end
  end

  private

  def card_params
    params.permit(:title, :body)
  end

  def find_board
    @board = Board.find_by identifier: params[:board]
  end

  def find_card
    @card = Card.find_by identifier: params[:id]
  end
end
