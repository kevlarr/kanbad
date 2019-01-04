use uuid::Uuid;

use super::schema::workspaces;

#[derive(Queryable, Serialize)]
pub struct Workspace {
    pub id: i32,
    pub identifier: Uuid,
}

#[derive(Insertable)]
#[table_name="workspaces"]
pub struct NewWorkspace {
    pub identifier: Uuid,
}
