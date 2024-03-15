"use client"
import { Paper, Stack, Tab, Tabs } from "@mui/material"
import React, { useState } from "react"

import { BalanceSection } from "@/components/BalanceSection"
import { IdBlock } from "@/components/IdBlock"
import { Subheading } from "@/components/Subheading"

import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"
import { EntityMessages } from "./EntityMessages"

type UserPageProps = {
  entityId: string
}

export function UserPage(props: UserPageProps) {
  const { entityId } = props

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="USER" value={<IdBlock label={entityId} />} />
      <BalanceSection entityId={entityId} />
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <Tab value={0} label="Messages" />
          <Tab value={1} label="Token transfers" />
          <Tab value={2} label="Token balances" />
        </Tabs>
        <Paper sx={{ marginX: -2 }}>
          <EntityMessages entityId={entityId} open={activeTab === 0} />
          <TokenTransfers entityId={entityId} open={activeTab === 1} />
          <TokenBalances entityId={entityId} open={activeTab === 2} />
        </Paper>
      </div>
    </Stack>
  )
}
