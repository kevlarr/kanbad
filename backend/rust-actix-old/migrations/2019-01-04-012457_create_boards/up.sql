CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    identifier UUID NOT NULL,
    workspace_id INTEGER REFERENCES workspaces(id) NOT NULL,
    title VARCHAR(30) NOT NULL
);

CREATE UNIQUE INDEX boards_identifier_idx ON boards (identifier);
