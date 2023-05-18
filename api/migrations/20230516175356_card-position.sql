alter table card
  add column position int,
  add constraint card_board_id_position_key
    unique (board_id, position)
    deferrable;
