import { Stack, Typography } from "@mui/material"
import React, { ReactNode } from "react"

type SubheadingProps = {
  type: string
  value: ReactNode
}

export function Subheading(props: SubheadingProps) {
  const { type, value } = props

  return (
    <Typography variant="body2" component="div">
      <Stack direction="row" gap={1} alignItems="center">
        <Typography variant="inherit" color="text.secondary">
          {type}
        </Typography>
        <Typography variant="inherit" fontWeight={700}>
          /
        </Typography>
        {value}
      </Stack>
    </Typography>
  )
}
