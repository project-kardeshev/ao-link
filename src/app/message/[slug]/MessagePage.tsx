"use client"

import { Box, CircularProgress, Paper, Stack, Tabs, Tooltip, Typography } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { useParams } from "react-router-dom"

import { ComputeResult } from "./ComputeResult"
import { LinkedMessages } from "./LinkedMessages"
import { MessageData } from "./MessageData"
import { ResultingMessages } from "./ResultingMessages"
import { EntityBlock } from "@/components/EntityBlock"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"

import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"

import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

export function MessagePage() {
  const { messageId } = useParams()

  const [message, setMessage] = useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!messageId) return

    getMessageById(messageId).then(setMessage)
  }, [messageId])

  const pushedFor = message?.tags["Pushed-For"]

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [linkedMessages, setLinkedMessages] = useState<number>()
  const [resultingCount, setResultingCount] = useState<number>()

  const [graphMessages, setGraphMessages] = useState<AoMessage[] | null>(null)
  const [entities, setEntities] = useState<Record<string, AoMessage | undefined> | null>(null)

  useEffect(() => {
    if (!graphMessages || !message) return
    const entityIdsSet = new Set<string>()

    entityIdsSet.add(message.from)
    entityIdsSet.add(message.to)

    graphMessages?.forEach((x) => {
      entityIdsSet.add(x.from)
      entityIdsSet.add(x.to)
    })

    const entityIds = Array.from(entityIdsSet)

    Promise.all(entityIds.map(getMessageById)).then((entitiesArray) => {
      const newEntities = Object.fromEntries(
        entitiesArray.filter((x): x is AoMessage => x !== undefined).map((x) => [x.id, x]),
      )

      setEntities((prev) => ({ ...prev, ...newEntities }))
    })
  }, [graphMessages])

  const graphData = useMemo<ChartDataItem[] | null>(() => {
    if (!message || graphMessages === null || !entities) return null

    const results: ChartDataItem[] = graphMessages.map((x) => {
      const source_type = entities[x.from]?.type || "User"
      const target_type = entities[x.to]?.type || "User"

      return {
        highlight: message.id === x.id,
        id: x.id,
        source: `${source_type} ${truncateId(x.from)}`,
        source_id: x.from,
        target: `${target_type} ${truncateId(x.to)}`,
        target_id: x.to,
        type: "Cranked Message",
        action: x.tags["Action"] || "No Action Tag",
      }
    })

    const firstSourceType = entities[message.from]?.type || "User"
    const firstTargetType = entities[message.to]?.type || "User"

    return [
      {
        highlight: message.id === message.id,
        id: message.id,
        source: `${firstSourceType} ${truncateId(message.from)}`,
        source_id: message.from,
        target: `${firstTargetType} ${truncateId(message.to)}`,
        target_id: message.to,
        type: "User Message",
        action: message.tags["Action"] || "No Action Tag",
      },
      ...results,
    ]
  }, [graphMessages, message, pushedFor, entities])

  const handleDataReady = useCallback((data: AoMessage[]) => {
    setEntities(null)
    setGraphMessages(data)
  }, [])

  if (message === null) return <LoadingSkeletons />

  if (!messageId || !message) {
    return <div>Not Found</div>
  }

  const { from, type, blockHeight, created, to, systemTags, userTags } = message

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="MESSAGE" value={<IdBlock label={messageId} />} />
        <Grid2 container spacing={{ xs: 2, lg: 12 }}>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <Paper sx={{ height: 428, width: 428 }}>
                {graphData === null ? (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <CircularProgress size={24} color="primary" />
                  </Stack>
                ) : graphData.length > 0 ? (
                  <Graph data={graphData} />
                ) : (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                      Nothing to see here.
                    </Typography>
                  </Stack>
                )}
              </Paper>
              <SectionInfoWithChip title="Type" value={type} />
              <SectionInfo title="From" value={<EntityBlock entityId={from} />} />
              {to && <SectionInfo title="To" value={<EntityBlock entityId={to} />} />}
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
                  created === null ? (
                    "Processing"
                  ) : (
                    <Tooltip title={formatFullDate(created)}>
                      <span>{formatRelative(created)}</span>
                    </Tooltip>
                  )
                }
              />
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <TagsSection label="Tags" tags={userTags} />
              <TagsSection label="System Tags" tags={systemTags} />
              <ComputeResult messageId={messageId} processId={to} />
              <MessageData message={message} />
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
          <Tabs value={activeTab} onChange={handleChange} textColor="primary">
            <TabWithCount value={0} label="Resulting messages" chipValue={resultingCount} />
            <TabWithCount value={1} label="Linked messages" chipValue={linkedMessages} />
          </Tabs>
          <Box sx={{ marginX: -2 }}>
            {activeTab === 0 && (
              <ResultingMessages
                message={message}
                onCountReady={setResultingCount}
                onDataReady={handleDataReady}
              />
            )}
            {activeTab === 1 && (
              <LinkedMessages
                pushedFor={pushedFor}
                messageId={messageId}
                onCountReady={setLinkedMessages}
                onDataReady={handleDataReady}
              />
            )}
          </Box>
        </div>
      </Stack>
    </React.Fragment>
  )
}
