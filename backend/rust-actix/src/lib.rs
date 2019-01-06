#[macro_use]
extern crate diesel;

extern crate serde;
#[macro_use]
extern crate serde_derive;

use diesel::{pg::PgConnection, prelude::*};
use uuid::Uuid;

pub mod models;
pub mod schema;

use self::models::{Board, NewBoard, Workspace, NewWorkspace};

// TODO propagate errors rather than `.expect()`
pub fn create_workspace(conn: &PgConnection) -> Workspace {
    use self::schema::workspaces;

    let identifier = Uuid::new_v4();
    let new_workspace = NewWorkspace { identifier };

    diesel::insert_into(workspaces::table)
        .values(&new_workspace)
        .get_result(conn)
        .expect("Error saving workspace")
}

pub fn create_board(conn: &PgConnection, workspace_id: i32) -> Board {
    use self::schema::boards;

    let identifier = Uuid::new_v4();
    let new_board = NewBoard {
        title: "New Board".into(),
        workspace_id,
        identifier,
    };

    diesel::insert_into(boards::table)
        .values(&new_board)
        .get_result(conn)
        .expect("Error saving board")
}

pub fn find_workspace(conn: &PgConnection, workspace_identifier: Uuid) -> Option<Workspace> {
    use self::schema::workspaces::dsl::*;

    match workspaces.filter(identifier.eq(workspace_identifier)).first(conn) {
        Ok(workspace) => Some(workspace),
        Err(_) => None,
    }
}

pub fn find_board(conn: &PgConnection, board_identifier: Uuid) -> Option<Board> {
    use self::schema::boards::dsl::*;

    match boards.filter(identifier.eq(board_identifier)).first(conn) {
        Ok(board) => Some(board),
        Err(_) => None,
    }
}
