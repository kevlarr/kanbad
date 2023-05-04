class CreateWorkspaces < ActiveRecord::Migration[5.2]
  def change
    create_table :workspaces do |t|
      t.uuid :identifier, null: false
    end
    add_index :workspaces, :identifier, unique: true
  end
end
