import { Stack, Typography } from "@mui/material"
import React, { ReactNode } from "react"

type SubheadingProps = {
  type: string
  value?: ReactNode
}

export function Subheading(props: SubheadingProps) {
  const { type, value } = props

  if (value === undefined) {
    return (
      <Typography
        variant="body2"
        component="div"
        color="text.secondary"
        fontWeight={700}
        sx={{ textTransform: "uppercase" }}
      >
        {type}
      </Typography>
    )
  }

  return (
    <Typography variant="body2" component="div">
      <Stack direction="row" gap={1} alignItems="center">
        <Typography
          variant="inherit"
          color="text.secondary"
          sx={{ textTransform: "uppercase" }}
          fontWeight={700}
        >
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
