import { hashString } from "./data-utils"

export function getColorFromText(text: string) {
  const colors: Record<string, string> = {
    red: "var(--mui-palette-red)",
    blue: "var(--mui-palette-blue)",
    green: "var(--mui-palette-green)",
    lime: "var(--mui-palette-lime)",
    yellow: "var(--mui-palette-yellow)",
    purple: "var(--mui-palette-purple)",
    indigo: "var(--mui-palette-indigo)",
    cyan: "var(--mui-palette-cyan)",
    pink: "var(--mui-palette-pink)",
    orange: "var(--mui-palette-orange)",
  }

  const colorKeys = Object.keys(colors)
  const hash = hashString(text)
  const colorIndex = Math.abs(hash) % colorKeys.length
  return colors[colorKeys[colorIndex]]
}
