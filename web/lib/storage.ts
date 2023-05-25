const USER_KEY = 'kanbad/user'

export function getUser(): string {
  let uuid = localStorage.getItem(USER_KEY)

  if (!uuid) {
    uuid = crypto.randomUUID()
    localStorage.setItem(USER_KEY, uuid)
  }

  return uuid
}
