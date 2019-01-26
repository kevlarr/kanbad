//!
//! Domain models
//!
//! Note that the order of fields on structs must match
//! the order of fields in `schema.rs`
//!

use uuid::Uuid;

use super::schema::{boards, workspaces};

#[derive(Queryable, Serialize)]
pub struct Workspace {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
}

#[derive(Insertable)]
#[table_name="workspaces"]
pub struct NewWorkspace {
    pub identifier: Uuid,
}

#[derive(Associations, Queryable, Serialize)]
#[belongs_to(Workspace)]
pub struct Board {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    pub workspace_id: i32,
    pub title: String,
}

#[derive(Insertable)]
#[table_name="boards"]
pub struct NewBoard {
    pub identifier: Uuid,
    pub workspace_id: i32,
    pub title: String,
}
