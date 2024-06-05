"use client"
import { Box, Stack, Tabs, Tooltip } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useState } from "react"

import { ProcessesByModule } from "@/app/entity/[slug]/ProcessesByModule"
import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"
import { AoMessage } from "@/types"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type ModulePageProps = {
  message: AoMessage
}

export function ModulePage(props: ModulePageProps) {
  const { message } = props

  const { id: moduleId, created } = message

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [processesCount, setProcessesCount] = useState<number>()

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="MODULE" value={<IdBlock label={moduleId} />} />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfoWithChip title="Type" value={"Module"} />
            <SectionInfo
              title="Created"
              value={
                created === null ? (
                  "Processing"
                ) : (
                  <Tooltip title={formatFullDate(created)}>
                    <span>{formatRelative(created)}</span>
                  </Tooltip>
                )
              }
            />
            {/* <SectionInfo title="Incoming messages" value={formatNumber(message.incoming_messages)} /> */}
            {/* <SectionInfo title="Processes" value={formatNumber(message.processes)} /> */}
          </Stack>
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfo title="Memory limit" value={message.tags["Memory-Limit"]} />
            <SectionInfo
              title="Compute limit"
              value={formatNumber(parseInt(message.tags["Compute-Limit"]))}
            />
            <SectionInfo title="Data protocol" value={message.tags["Data-Protocol"]} />
            <SectionInfo title="Input encoding" value={message.tags["Input-Encoding"]} />
            <SectionInfo title="Output encoding" value={message.tags["Output-Encoding"]} />
            <SectionInfo title="Content Type" value={message.tags["Content-Type"]} />
            <SectionInfo title="Module format" value={message.tags["Module-Format"]} />
            <SectionInfo title="Variant" value={message.tags["Variant"]} />
          </Stack>
        </Grid2>
      </Grid2>
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount value={0} label="Processes" chipValue={processesCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <ProcessesByModule
            moduleId={moduleId}
            open={activeTab === 0}
            onCountReady={setProcessesCount}
          />
        </Box>
      </div>
    </Stack>
  )
}
