const WORKSPACES_KEY = 'kanbad/workspaces'

export function getWorkspaces(): Array<string> {
  const uuids = localStorage.getItem(WORKSPACES_KEY)

  return typeof uuids === 'string'
    ? Array.from(JSON.parse(uuids))
    : []
}

export function addWorkspace(identifier: string) {
  let uuids = getWorkspaces()
  uuids.push(identifier)
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(uuids))
}
