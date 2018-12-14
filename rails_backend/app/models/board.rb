class Board < ApplicationRecord
  belongs_to :workspace
  validates :identifier, presence: true, uniqueness: true

  def as_json(opts = {})
    super(opts).merge(workspace: workspace.as_json(only: :identifier))
  end
end
