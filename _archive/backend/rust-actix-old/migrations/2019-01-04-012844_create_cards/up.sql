CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    identifier UUID NOT NULL,
    board_id INTEGER REFERENCES boards(id) NOT NULL,
    title VARCHAR(30) NOT NULL,
    body TEXT
);

CREATE UNIQUE INDEX cards_identifier_idx ON cards (identifier);
