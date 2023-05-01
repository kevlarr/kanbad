create table workspace (
    id int primary key generated always as identity,
    identifier uuid unique not null
);

create table board (
    id int primary key generated always as identity,
    identifier uuid unique not null,
    workspace_id integer references workspace(id) not null,
    title text not null
);

create table card (
    id int primary key generated always as identity,
    identifier uuid unique not null,
    board_id integer references board(id) not null,
    title text not null,
    body text
);
