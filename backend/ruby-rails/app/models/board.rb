class Board < ApplicationRecord
  belongs_to :workspace
  validates :identifier, presence: true, uniqueness: true

  scope :for_workspace, -> ident { joins(:workspace).where(workspaces: {identifier: ident}) }

  def as_json(opts = {})
    super(opts).merge(workspace: workspace.as_json(only: :identifier))
  end
end
