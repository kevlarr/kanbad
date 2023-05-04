alter table card
    drop constraint card_board_id_fkey,
    add  constraint card_board_id_fkey
        foreign key (board_id)
            references board(id)
            on delete cascade
            on update cascade;
