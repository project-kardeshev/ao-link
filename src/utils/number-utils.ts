const locale =
  typeof window !== "undefined" ? window.navigator.language : "en-US"

export function formatNumber(
  number: number,
  opts: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    notation: "standard",
    // minimumIntegerDigits: 2,
    ...opts,
  }).format(number)
}
