CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    identifier UUID NOT NULL
);

CREATE UNIQUE INDEX workspaces_identifier_idx ON workspaces (identifier);
