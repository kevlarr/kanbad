class Workspace < ApplicationRecord
  validates :identifier, presence: true, uniqueness: true
end
