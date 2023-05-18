use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct BoardUpdate {
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct NewBoard {
    #[serde(rename = "workspace")]
    pub workspace_identifier: Uuid,
    pub title: String,
}

#[derive(Debug, Serialize)]
pub struct Board {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    #[serde(rename = "workspace")]
    pub workspace_identifier: Uuid,
    pub title: String,
}

pub async fn find_all(pool: &PgPool, workspace_identifier: &Uuid) -> Vec<Board> {
    sqlx::query_as!(
        Board,
        "
        select
            b.id,
            b.identifier,
            b.title,
            w.identifier as workspace_identifier

        from board b
        join workspace w on w.id = b.workspace_id

        where w.identifier = $1

        order by
            b.id asc
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
        returning id, identifier, title, $2 as "workspace_identifier!"
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
            w.identifier as workspace_identifier
        ",
        &board_identifier,
        &params.title,
    )
        .fetch_one(pool)
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
