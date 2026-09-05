interface JwtPayload {
  exp?: number
  [key: string]: any
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalized))
  } catch (e) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return decoded.exp <= nowInSeconds
}
