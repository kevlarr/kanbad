alter table workspace
  add column creator uuid,
  add column position int,
  add column title text,
  add constraint workspace_creator_position_key
    unique (creator, position)
    deferrable;

update workspace set creator = gen_random_uuid()
where creator is null;

update workspace set title = identifier
where title is null;

alter table workspace
  alter column creator set not null,
  alter column title set not null;
