"use client"

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useCallback, useEffect, useState } from "react"

import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"
import { supabase } from "@/lib/supabase"

import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { ComputeResult } from "./ComputeResult"
import { ResultingMessages } from "./ResultingMessages"

type MessagePageProps = {
  message: AoMessage
  data: string
}

export function MessagePage(props: MessagePageProps) {
  const { message, data } = props

  const {
    id: messageId,
    from,
    type,
    blockHeight,
    created,
    to,
    tags,
    systemTags,
    userTags,
  } = message

  const pushedFor = tags["Pushed-For"]

  const [loading, setLoading] = useState(true)
  const [graphData, setChartData] = useState<ChartDataItem[]>([])

  useEffect(() => {
    setLoading(true)
    console.log("fetching graph")
    supabase
      .rpc("get_message_network_v2", {
        p_id: messageId,
        is_process: false,
      })
      .returns<{ graph: ChartDataItem[]; messages: any[] }>()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error calling Supabase RPC:", error.message)
          return
        }

        const { graph, messages } = data

        setChartData(graph)
        setLoading(false)
      })
  }, [messageId])

  const [tableFilter, setTableFilter] = useState<{
    from: string
    to: string
  } | null>(null)

  const handleLinkClick = useCallback((from: string, to: string) => {
    setTableFilter({ from, to })
  }, [])

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [resultingCount, setResultingCount] = useState<number>()

  return (
    <>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="MESSAGE" value={<IdBlock label={messageId} />} />
        <Grid2 container spacing={{ xs: 2, lg: 12 }}>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <Paper sx={{ height: 428, width: 428 }}>
                {loading ? (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <CircularProgress size={24} color="primary" />
                  </Stack>
                ) : (
                  <Graph data={graphData} onLinkClick={handleLinkClick} />
                )}
              </Paper>
              <SectionInfoWithChip title="Type" value={type} />
              <SectionInfo
                title="From"
                value={<IdBlock label={truncateId(from)} value={from} href={`/entity/${from}`} />}
              />
              {to && (
                <SectionInfo
                  title="To"
                  value={<IdBlock label={truncateId(to)} value={to} href={`/entity/${to}`} />}
                />
              )}
              {pushedFor && (
                <SectionInfo
                  title="Pushed for"
                  value={
                    <IdBlock
                      label={truncateId(pushedFor)}
                      value={pushedFor}
                      href={`/message/${pushedFor}`}
                    />
                  }
                />
              )}
              <SectionInfo
                title="Block Height"
                value={
                  blockHeight === null ? (
                    "Processing"
                  ) : (
                    <IdBlock
                      label={formatNumber(blockHeight)}
                      value={String(blockHeight)}
                      href={`/block/${blockHeight}`}
                    />
                  )
                }
              />
              <SectionInfo
                title="Created"
                value={
                  <Tooltip title={formatFullDate(created)}>
                    <span>{formatRelative(created)}</span>
                  </Tooltip>
                }
              />
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <TagsSection label="Tags" tags={userTags} />
              <TagsSection label="System Tags" tags={systemTags} />
              <ComputeResult messageId={messageId} processId={to} />
              <Stack gap={1} justifyContent="stretch">
                <Typography variant="subtitle2" color="text.secondary">
                  Data
                </Typography>
                <TextField
                  sx={(theme) => ({
                    bgcolor: "var(--mui-palette-background-paper)",
                    "& textarea": {
                      ...theme.typography.body2,
                      fontFamily: MonoFontFF,
                      resize: "both",
                      minWidth: "100%",
                      minHeight: 200,
                    },
                  })}
                  rows={1}
                  multiline
                  variant="outlined"
                  value={data}
                />
              </Stack>
              <Stack gap={1} justifyContent="stretch">
                <Typography variant="subtitle2" color="text.secondary">
                  Result Type
                </Typography>
                <Paper sx={{ width: "100%", padding: 2 }}>
                  <Typography variant="body2" fontFamily={MonoFontFF}>
                    JSON
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </Grid2>
        </Grid2>
        <div>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Tabs value={activeTab} onChange={handleChange} textColor="primary">
              <TabWithCount value={0} label="Resulting messages" chipValue={resultingCount} />
            </Tabs>
            {tableFilter && (
              <Button size="small" variant="outlined" onClick={() => setTableFilter(null)}>
                Clear filter
              </Button>
            )}
          </Stack>
          <Box sx={{ marginX: -2 }}>
            <ResultingMessages
              messageId={messageId}
              entityId={from}
              open={activeTab === 0}
              onCountReady={setResultingCount}
            />
          </Box>
        </div>
      </Stack>
    </>
  )
}
