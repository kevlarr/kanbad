// @generated automatically by Diesel CLI.

diesel::table! {
    boards (id) {
        id -> Int4,
        identifier -> Uuid,
        workspace_id -> Int4,
        title -> Varchar,
    }
}

diesel::table! {
    cards (id) {
        id -> Int4,
        identifier -> Uuid,
        board_id -> Int4,
        title -> Varchar,
        body -> Nullable<Text>,
    }
}

diesel::table! {
    workspaces (id) {
        id -> Int4,
        identifier -> Uuid,
    }
}

diesel::joinable!(boards -> workspaces (workspace_id));
diesel::joinable!(cards -> boards (board_id));

diesel::allow_tables_to_appear_in_same_query!(
    boards,
    cards,
    workspaces,
);
