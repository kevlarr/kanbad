use serde::Serialize;
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct Workspace {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
}

pub async fn find(pool: &PgPool, identifier: &Uuid) -> Option<Workspace> {
    sqlx::query_as!(
        Workspace,
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

pub async fn create(pool: &PgPool) -> Workspace {
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
