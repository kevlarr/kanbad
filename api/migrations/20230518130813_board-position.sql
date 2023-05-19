alter table board
  add column position int,
  add constraint board_workspace_id_position_key
    unique (workspace_id, position)
    deferrable;
