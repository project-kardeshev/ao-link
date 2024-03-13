import { Stack, Typography } from "@mui/material"
import React from "react"

import { getColorFromText } from "@/utils/color-utils"

import { MonoFontFF } from "./RootLayout/fonts"

export function TagsSection({ tags }: { tags: Record<string, string> }) {
  return (
    <Stack gap={1} justifyContent="stretch">
      <Typography variant="subtitle2" color="text.secondary">
        Tags
      </Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ maxHeight: 178, overflowY: "auto" }}
      >
        {Object.entries(tags).map(([key, value]) => (
          <Typography
            key={key}
            sx={{
              padding: 0.5,
              color: "black",
              background: getColorFromText(key),
            }}
            variant="caption"
            fontFamily={MonoFontFF}
          >
            {key}:{value}
          </Typography>
        ))}
      </Stack>
    </Stack>
  )
}
