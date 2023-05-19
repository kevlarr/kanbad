use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct BoardUpdate {
    pub title: String,
}

// This currently does not allow updating a board's WORKSPACE the same way
// that cards can have their board updated by 'location'
#[derive(Deserialize)]
pub struct BoardLocationUpdate {
    #[serde(rename = "board")]
    pub board_identifier: String,
    pub position: i32,
}

#[derive(Debug, Deserialize)]
pub struct NewBoard {
    #[serde(rename = "workspace")]
    pub workspace_identifier: Uuid,
    pub title: String,
}

#[derive(Debug, FromRow, Serialize)]
pub struct Board {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    #[serde(rename = "workspace")]
    pub workspace_identifier: Uuid,
    pub title: String,
    pub position: Option<i32>,
}

pub async fn find_all(pool: &PgPool, workspace_identifier: &Uuid) -> Vec<Board> {
    sqlx::query_as!(
        Board,
        "
        select
            b.id,
            b.identifier,
            b.title,
            b.position,
            w.identifier as workspace_identifier

        from board b
        join workspace w on w.id = b.workspace_id

        where w.identifier = $1
        ",
        &workspace_identifier
    )
        .fetch_all(pool)
        .await
        .unwrap()
}

pub async fn create(pool: &PgPool, params: &NewBoard) -> Board {
    let identifier = Uuid::new_v4();

    sqlx::query_as!(
        Board,
        r#"
        insert into board (
            identifier,
            workspace_id,
            title
        )
        values (
            $1,
            (select id from workspace where identifier = $2),
            $3
        )
        returning
            id,
            identifier,
            title,
            position,
            $2 as "workspace_identifier!"
        "#,
        &identifier,
        params.workspace_identifier,
        &params.title,
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

pub async fn update(pool: &PgPool, board_identifier: &Uuid, params: &BoardUpdate) -> Board {
    sqlx::query_as!(
        Board,
        "
        update board
        set title = $2
        from workspace w

        where w.id = board.workspace_id
            and board.identifier = $1

        returning
            board.id,
            board.identifier,
            board.title,
            board.position,
            w.identifier as workspace_identifier
        ",
        &board_identifier,
        &params.title,
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

#[deprecated(note = "FIXME: sql injection")]
pub async fn update_locations(pool: &PgPool, param_list: &[BoardLocationUpdate]) -> Vec<Board> {
    let values = param_list.iter()
        .map(|p| format!(
            "('{}', {})",
            &p.board_identifier,
            p.position,
        ))
        .collect::<Vec<_>>()
        .join(", ");

    sqlx::query_as::<_, Board>(
        &format!(
            "
            update board set
                position = vals.position

            from workspace
            join (values {values}) vals (
                board_identifier,
                position
            ) on true

            where vals.board_identifier::uuid = board.identifier
              and workspace.id = board.workspace_id

            returning
                board.id,
                board.identifier,
                board.title,
                board.position,
                workspace.identifier as workspace_identifier
            "),

    )
        .fetch_all(pool)
        .await
        .unwrap()
}

pub async fn delete(pool: &PgPool, board_identifier: &Uuid) -> bool {
    let rows_affected = sqlx::query!(
        "
        delete from board
        where identifier = $1
        ",
        &board_identifier
    )
        .execute(pool)
        .await
        .unwrap()
        .rows_affected();

    rows_affected > 0
}
