use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::postgres::PgPool;
use uuid::Uuid;

#[derive(Debug, FromRow, Serialize)]
pub struct Workspace {
    #[serde(skip_serializing)]
    pub id: i32,
    pub identifier: Uuid,
    pub creator: Uuid,
    pub title: String,
    pub position: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct NewWorkspace {
    pub creator: Uuid,
    pub title: String,
}

#[derive(Deserialize)]
pub struct WorkspaceUpdate {
    pub title: String,
}

#[derive(Deserialize)]
pub struct WorkspaceLocationUpdate {
    #[serde(rename = "workspace")]
    pub workspace_identifier: Uuid,
    pub position: i32,
}

pub async fn find(pool: &PgPool, identifier: &Uuid) -> Option<Workspace> {
    sqlx::query_as!(
        Workspace,
        "
        select
            id,
            identifier,
            creator,
            title,
            position
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

pub async fn find_all(pool: &PgPool, creator: &Uuid) -> Vec<Workspace> {
    sqlx::query_as!(
        Workspace,
        "
        select
            id,
            identifier,
            creator,
            title,
            position

        from workspace

        where creator = $1
        ",
        &creator,
    )
        .fetch_all(pool)
        .await
        .unwrap()
}

pub async fn create(pool: &PgPool, params: &NewWorkspace) -> Workspace {
    let identifier = Uuid::new_v4();

    sqlx::query_as!(
        Workspace,
        "
        insert into workspace (
            identifier,
            creator,
            title
        )
        values ($1, $2, $3)
        returning
            id,
            identifier,
            creator,
            title,
            position
        ",
        &identifier,
        &params.creator,
        &params.title,
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

pub async fn update(pool: &PgPool, workspace_identifier: &Uuid, params: &WorkspaceUpdate) -> Workspace {
    sqlx::query_as!(
        Workspace,
        "
        update workspace set title = $2
        where identifier = $1
        returning
            id,
            identifier,
            creator,
            title,
            position
        ",
        &workspace_identifier,
        &params.title,
    )
        .fetch_one(pool)
        .await
        .unwrap()
}

#[deprecated(note = "FIXME: sql injection")]
pub async fn update_locations(pool: &PgPool, param_list: &[WorkspaceLocationUpdate]) -> Vec<Workspace> {
    let values = param_list.iter()
        .map(|p| format!(
            "('{}', {})",
            &p.workspace_identifier,
            p.position,
        ))
        .collect::<Vec<_>>()
        .join(", ");

    sqlx::query_as::<_, Workspace>(
        &format!(
            "
            update workspace set position = vals.position

            from (values {values}) vals (
                identifier,
                position
            )

            where vals.identifier::uuid = workspace.identifier

            returning
                id,
                workspace.identifier,
                creator,
                title,
                workspace.position
            "),

    )
        .fetch_all(pool)
        .await
        .unwrap()
}
