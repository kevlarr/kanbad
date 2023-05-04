class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.belongs_to :board, null: false, foreign_key: true
      t.uuid :identifier, null: false
      t.string :title, null: false, limit: 30
      t.text :body
    end
    add_index :cards, :identifier, unique: true
  end
end
