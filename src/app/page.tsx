"use client"

import { Box, Skeleton, Stack } from "@mui/material"

import { useEffect, useState } from "react"

import { AreaChart } from "@/components/Charts/AreaChart"

import { Subheading } from "@/components/Subheading"
import {
  getMessageStats,
  getModuleStats,
  getProcessStats,
  getTotalMessages,
  getUserStats,
} from "@/services/aometrics"

import { HighchartAreaDataServer } from "@/types"

import { AllMessagesTable } from "./AllMessagesTable"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const [stats, setStats] = useState<
    [
      HighchartAreaDataServer[],
      number,
      HighchartAreaDataServer[],
      HighchartAreaDataServer[],
      HighchartAreaDataServer[],
    ]
  >([[], 0, [], [], [], []] as any)

  useEffect(() => {
    Promise.all([
      getMessageStats(),
      getTotalMessages(),
      getModuleStats(),
      getUserStats(),
      getProcessStats(),
    ]).then(setStats)
  }, [])

  const [messages, totalMessages, modules, users, processes] = stats

  return (
    <Stack component="main" gap={2}>
      {messages.length === 0 ? (
        <div className="flex justify-between flex-wrap mt-[24px] mx-[-24px]">
          <div className="container px-4 min-h-[150px] relative">
            <Stack gap={10} direction="row">
              <Skeleton width={"100%"} />
              <Skeleton width={"100%"} />
              <Skeleton width={"100%"} />
              <Skeleton width={"100%"} />
            </Stack>
          </div>
        </div>
      ) : (
        <div className="flex justify-between flex-wrap mt-[24px] mx-[-24px]">
          <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
            <AreaChart data={messages} titleText="TOTAL MESSAGES" overrideValue={totalMessages} />
            <div className="separator"></div>
          </div>
          <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
            <AreaChart data={users} titleText="USERS" />
            <div className="separator hidden lg:block"></div>
          </div>
          <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
            <AreaChart data={processes} titleText="PROCESSES" />
            <div className="separator"></div>
          </div>
          <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
            <AreaChart data={modules} titleText="MODULES" />
          </div>
        </div>
      )}
      <Subheading type="Latest messages" />
      <Box sx={{ marginX: -2 }}>
        <AllMessagesTable open />
      </Box>
    </Stack>
  )
}
