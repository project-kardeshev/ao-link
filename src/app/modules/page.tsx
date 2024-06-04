"use client"

import { Box, Stack } from "@mui/material"

import { useState } from "react"

import { Subheading } from "@/components/Subheading"

import { AllModules } from "./AllModules"

export default function ModulesPage() {
  const [modulesCount, setModulesCount] = useState<number>()

  return (
    <Stack component="main" gap={2} paddingY={4}>
      <Subheading type="Modules" value={modulesCount} />
      <Box sx={{ marginX: -2 }}>
        <AllModules open onCountReady={setModulesCount} />
      </Box>
    </Stack>
  )
}
