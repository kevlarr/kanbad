class CreateBoards < ActiveRecord::Migration[5.2]
  def change
    create_table :boards do |t|
      t.belongs_to :workspace, null: false, foreign_key: true
      t.uuid :identifier, null: false
      t.string :title, null: false, limit: 30
    end
    add_index :boards, :identifier, unique: true
  end
end
