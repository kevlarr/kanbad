table! {
    boards (id) {
        id -> Int4,
        identifier -> Uuid,
        workspace_id -> Int4,
        title -> Varchar,
    }
}

table! {
    cards (id) {
        id -> Int4,
        identifier -> Uuid,
        board_id -> Int4,
        title -> Varchar,
        body -> Nullable<Text>,
    }
}

table! {
    workspaces (id) {
        id -> Int4,
        identifier -> Uuid,
    }
}

joinable!(boards -> workspaces (workspace_id));
joinable!(cards -> boards (board_id));

allow_tables_to_appear_in_same_query!(
    boards,
    cards,
    workspaces,
);
