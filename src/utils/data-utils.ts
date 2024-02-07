export const truncateId = (text: string) => {
  if (!text || text.length <= 16) return text
  return text.slice(0, 8) + "..." + text.slice(-8)
}

export function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
