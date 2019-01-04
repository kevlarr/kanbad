#[macro_use]
extern crate diesel;

extern crate serde;
#[macro_use]
extern crate serde_derive;

use diesel::{pg::PgConnection, prelude::*};
use uuid::Uuid;

pub mod models;
pub mod schema;

use self::models::{Workspace, NewWorkspace};

pub fn create_workspace(conn: &PgConnection) -> Workspace {
    use self::schema::workspaces;

    let identifier = Uuid::new_v4();
    let new_workspace = NewWorkspace { identifier };

    diesel::insert_into(workspaces::table)
        .values(&new_workspace)
        .get_result(conn)
        .expect("Error saving workspace")
}

pub fn find_workspace(conn: &PgConnection, workspace_identifier: &str) -> Option<Workspace> {
    use self::schema::workspaces::dsl::*;

    match Uuid::parse_str(workspace_identifier) {
        Ok(parsed) => match workspaces.filter(identifier.eq(parsed)).first(conn) {
            Ok(workspace) => Some(workspace),
            Err(_) => None,
        }
        Err(_) => None,
    }
}
