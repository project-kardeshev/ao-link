"use client"
import { Paper, Stack, Tab, Tabs } from "@mui/material"
import React, { useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { nativeTokenInfo } from "@/utils/native-token"

import { InboxTable } from "./InboxTable"
import { OutboxTable } from "./OutboxTable"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"

type UserPageProps = {
  entityId: string
  balance: number | null
}

export function UserPage(props: UserPageProps) {
  const { entityId, balance } = props

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="USER" value={<IdBlock label={entityId} />} />
      {balance !== null && (
        <SectionInfo
          title="Balance"
          value={
            <TokenAmountBlock
              amount={balance}
              tokenInfo={nativeTokenInfo}
              needsParsing
              showTicker
            />
          }
        />
      )}
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <Tab value={0} label="Outbox" />
          <Tab value={1} label="Inbox" />
          <Tab value={2} label="Token transfers" />
          <Tab value={3} label="Token balances" />
        </Tabs>
        <Paper sx={{ marginX: -2 }}>
          <OutboxTable entityId={entityId} open={activeTab === 0} />
          <InboxTable entityId={entityId} open={activeTab === 1} />
          <TokenTransfers entityId={entityId} open={activeTab === 2} />
          <TokenBalances entityId={entityId} open={activeTab === 3} />
        </Paper>
      </div>
    </Stack>
  )
}
