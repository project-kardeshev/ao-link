"use client"

import { Box, Stack, Tabs } from "@mui/material"

import { useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"

import { formatNumber } from "@/utils/number-utils"

import { BlockMessagesTable } from "./BlockMessagesTable"

type BlockPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default function BlockPage(props: BlockPageProps) {
  const { slug } = props.params
  const blockHeight = parseInt(slug)

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [messagesCount, setMessagesCount] = useState<number>()

  return (
    <Stack component="main" gap={4} paddingY={4}>
      <Subheading type="Block" value={<IdBlock label={formatNumber(blockHeight)} />} />
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount value={0} label="Messages" chipValue={messagesCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <BlockMessagesTable open blockHeight={blockHeight} onCountReady={setMessagesCount} />
        </Box>
      </div>
    </Stack>
  )
}
