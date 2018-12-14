# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_12_13_205801) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "boards", force: :cascade do |t|
    t.bigint "workspace_id", null: false
    t.uuid "identifier", null: false
    t.string "title", limit: 30, null: false
    t.index ["identifier"], name: "index_boards_on_identifier", unique: true
    t.index ["workspace_id"], name: "index_boards_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.uuid "identifier", null: false
    t.index ["identifier"], name: "index_workspaces_on_identifier", unique: true
  end

  add_foreign_key "boards", "workspaces"
end
