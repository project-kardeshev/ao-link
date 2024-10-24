"use client"

import { Box, Stack } from "@mui/material"

import { ArnsTable } from "./ArnsTable"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { Subheading } from "@/components/Subheading"

import { useArnsRecords } from "@/hooks/useArnsRecords"

export default function ArnsPage() {
  const records = useArnsRecords()

  return (
    <Stack component="main" gap={2} paddingY={4}>
      <Subheading type="ArNS Records" value={records ? records.length : undefined} />
      <Box sx={{ marginX: -2 }}>
        {!records ? <LoadingSkeletons /> : <ArnsTable data={records} />}
      </Box>
    </Stack>
  )
}
