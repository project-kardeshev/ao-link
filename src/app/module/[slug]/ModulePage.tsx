"use client"
import { Box, Paper, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useQuery } from "@tanstack/react-query"
import React, { useMemo, useState } from "react"

import { useParams } from "react-router-dom"

import { ProcessesByModule } from "@/app/entity/[slug]/ProcessesByModule"
import { CodeEditor } from "@/components/CodeEditor"
import { IdBlock } from "@/components/IdBlock"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"
import { getMessageById } from "@/services/messages-api"
import { getModuleBinary } from "@/services/modules-api"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"
import { isArweaveId } from "@/utils/utils"

async function extractLuaFromWasm(wasmBuffer: ArrayBuffer) {
  const byteArray = new Uint8Array(wasmBuffer)
  const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(byteArray)

  // Find the start of the Lua script
  const startMarker = "-- This script is bridge program for WASM"
  const startPos = utf8Text.indexOf(startMarker)

  if (startPos === -1) {
    console.warn("Lua script marker not found.")
    return ""
  }

  // Slice everything after the Lua script marker
  let extractedText = utf8Text.slice(startPos).trim()

  // Find the last occurrence of "return json" and truncate after it
  const endMarker = "return json"
  const lastEndPos = extractedText.lastIndexOf(endMarker)

  if (lastEndPos !== -1) {
    extractedText = extractedText.slice(0, lastEndPos + endMarker.length).trim()
  }

  // Remove all non-ASCII/unicode characters
  extractedText = extractedText.replace(/[^\x20-\x7E\t\n\r]/g, "")

  return extractedText
}

type EntityMessagesProps = {
  moduleId: string
  open: boolean
}

function WasmViewer({ moduleId, open }: EntityMessagesProps) {
  const isValidId = useMemo(() => isArweaveId(String(moduleId)), [moduleId])
  const {
    data: luaFiles,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(moduleId) && isValidId,
    queryKey: ["module", moduleId],
    queryFn: async () => {
      const binaryBuffer = await getModuleBinary(moduleId)
      return await extractLuaFromWasm(binaryBuffer)
    },
  })

  if (error) return <Typography>{JSON.stringify(error.message, null, 2)}</Typography>

  if (!open) return null

  if (isLoading) {
    return <LoadingSkeletons />
  }

  return (
    <Paper
      component={CodeEditor}
      value={luaFiles ?? ""}
      language="lua"
      defaultLanguage="lua"
      height={600}
      options={{
        minimap: { enabled: true },
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          useShadows: true,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        overviewRulerLanes: 0,
      }}
    />
  )
}

export function ModulePage() {
  const { moduleId = "" } = useParams()

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [processesCount, setProcessesCount] = useState<number>()

  const isValidId = useMemo(() => isArweaveId(String(moduleId)), [moduleId])

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(moduleId) && isValidId,
    queryKey: ["message", moduleId],
    queryFn: () => getMessageById(moduleId),
  })

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!isValidId || error || !message) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Module not found."}</Typography>
      </Stack>
    )
  }

  return (
    <Stack component="main" gap={6} paddingY={4} key={moduleId}>
      <Subheading type="MODULE" value={<IdBlock label={moduleId} />} />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfoWithChip title="Type" value={"Module"} />
            <SectionInfo
              title="Seen at"
              value={
                message.ingestedAt === null ? (
                  "Processing"
                ) : (
                  <Tooltip title={formatFullDate(message.ingestedAt)}>
                    <span>{formatRelative(message.ingestedAt)}</span>
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
          <Tab value={1} label={"Injected Lua Files"} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <ProcessesByModule
            moduleId={moduleId}
            open={activeTab === 0}
            onCountReady={setProcessesCount}
          />
          <WasmViewer moduleId={moduleId} open={activeTab === 1} />
        </Box>
      </div>
    </Stack>
  )
}
