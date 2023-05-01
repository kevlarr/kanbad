use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Serialize)]
pub struct Workspace {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
}

impl Workspace {
    pub async fn find(pool: &PgPool, identifier: &Uuid) -> Option<Self> {
        sqlx::query_as!(
            Self,
            "
            select id, identifier
            from workspace
            where identifier = $1
            limit 1
            ",
            &identifier
        )
            .fetch_optional(pool)
            .await
            .unwrap()
    }
}

pub struct NewWorkspace;

impl NewWorkspace {
    pub async fn create(&self, pool: &PgPool) -> Workspace {
        let identifier = Uuid::new_v4();

        sqlx::query_as!(
            Workspace,
            "
            insert into workspace (identifier)
            values ($1)
            returning id, identifier
            ",
            &identifier
        )
            .fetch_one(pool)
            .await
            .unwrap()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Board {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    pub title: String,
    pub workspace_id: i32,
}

impl Board {
    pub async fn find_all(pool: &PgPool, workspace_identifier: &Uuid) -> Vec<Self> {
        sqlx::query_as!(
            Self,
            "
            select b.id, b.identifier, b.title, b.workspace_id
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
}

pub struct NewBoard {
    pub workspace_id: i32,
    pub title: String,
}

impl NewBoard {
    pub async fn create(&self, pool: &PgPool) -> Board {
        let identifier = Uuid::new_v4();

        sqlx::query_as!(
            Board,
            "
            insert into board (identifier, workspace_id, title)
            values ($1, $2, $3)
            returning id, identifier, title, workspace_id
            ",
            &identifier,
            self.workspace_id,
            &self.title,
        )
            .fetch_one(pool)
            .await
            .unwrap()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    pub board_id: i32,
    pub title: String,
    pub body: Option<String>,
}

impl Card {
    pub async fn find_all(pool: &PgPool, workspace_identifier: &Uuid) -> Vec<Self> {
        sqlx::query_as!(
            Self,
            "
            select c.id, c.identifier, c.board_id, c.title, c.body
            from card c
            join board b on b.id = c.board_id
            join workspace w on w.id = b.workspace_id
            where w.identifier = $1
            ",
            &workspace_identifier
        )
            .fetch_all(pool)
            .await
            .unwrap()
    }
}

pub struct NewCard {
    pub board_id: i32,
    pub title: String,
}

impl NewCard {
    pub async fn create(&self, pool: &PgPool) -> Card {
        let identifier = Uuid::new_v4();

        sqlx::query_as!(
            Card,
            "
            insert into card (identifier, board_id, title)
            values ($1, $2, $3)
            returning id, identifier, board_id, title, body
            ",
            &identifier,
            self.board_id,
            &self.title,
        )
            .fetch_one(pool)
            .await
            .unwrap()
    }
}
