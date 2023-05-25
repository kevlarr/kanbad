use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize)]
pub struct Card {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    #[serde(rename = "board")]
    pub board_identifier: Uuid,
    pub title: String,
    pub body: Option<String>,
    pub position: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct NewCard {
    #[serde(rename = "board")]
    pub board_identifier: Uuid,
    pub title: String,
}

#[derive(Deserialize)]
pub struct CardUpdate {
    pub title: String,
    pub body: Option<String>,
}

#[derive(Deserialize)]
pub struct CardLocationUpdate {
    #[serde(rename = "board")]
    pub board_identifier: Uuid,
    #[serde(rename = "card")]
    pub card_identifier: Uuid,
    pub position: i32,
}

pub async fn find_all(pool: &PgPool, workspace_identifier: &Uuid) -> Vec<Card> {
    sqlx::query_as!(
        Card,
        "
        select
            card.id,
            card.identifier,
            card.title,
            card.body,
            card.position,
            board.identifier as board_identifier

        from card
        join board on board.id = card.board_id
        join workspace on workspace.id = board.workspace_id

        where workspace.identifier = $1
        ",
        &workspace_identifier
    )
        .fetch_all(pool)
        .await
        .unwrap()
}

pub async fn create(pool: &PgPool, params: &NewCard) -> Card {
    let identifier = Uuid::new_v4();

    sqlx::query_as!(
        Card,
        r#"
        insert into card (
            identifier,
            board_id,
            title
        )
        values (
            $1,
            (select id from board where identifier = $2),
            $3
        )
        returning id, identifier, title, body, position, $2 as "board_identifier!"
        "#,
        &identifier,
        params.board_identifier,
        &params.title,
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

pub async fn update(pool: &PgPool, card_identifier: &Uuid, params: &CardUpdate) -> Card {
    sqlx::query_as!(
        Card,
        "
        update card set title = $2, body = $3

        from board b
        where b.id = card.board_id and card.identifier = $1

        returning
            card.id,
            card.identifier,
            card.title,
            card.body,
            card.position,
            b.identifier as board_identifier
        ",
        &card_identifier,
        &params.title,
        params.body.as_deref(),
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

#[deprecated(note = "FIXME: sql injection")]
pub async fn update_locations(pool: &PgPool, param_list: &[CardLocationUpdate]) -> Vec<Card> {
    let values = param_list.iter()
        .map(|p| format!(
            "('{}', '{}', {})",
            &p.board_identifier,
            &p.card_identifier,
            p.position,
        ))
        .collect::<Vec<_>>()
        .join(", ");

    sqlx::query_as::<_, Card>(
        &format!(
            "
            update card set
                board_id = board.id,
                position = vals.position

            from board
            join (values {values}) vals (
                board_identifier,
                card_identifier,
                position
            ) on vals.board_identifier::uuid = board.identifier
            where vals.card_identifier::uuid = card.identifier

            returning
                card.id,
                card.identifier,
                card.title,
                card.body,
                card.position,
                board.identifier as board_identifier
            "),

    )
        .fetch_all(pool)
        .await
        .unwrap()
}

pub async fn delete(pool: &PgPool, card_identifier: &Uuid) -> bool {
    let rows_affected = sqlx::query!(
        "delete from card where identifier = $1",
        &card_identifier
    )
        .execute(pool)
        .await
        .unwrap()
        .rows_affected();

    rows_affected > 0
}
