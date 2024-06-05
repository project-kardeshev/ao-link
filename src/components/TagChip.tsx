import { Typography, TypographyProps } from "@mui/material"
import React from "react"

import { getColorFromText } from "@/utils/color-utils"

import { MonoFontFF } from "./RootLayout/fonts"

export function TagChip(props: TypographyProps & { name: string; value: string }) {
  const { name, value } = props

  return (
    <Typography
      sx={{
        padding: 0.5,
        color: "black",
        background: getColorFromText(name),
      }}
      variant="caption"
      fontFamily={MonoFontFF}
    >
      {name}:{value}
    </Typography>
  )
}
