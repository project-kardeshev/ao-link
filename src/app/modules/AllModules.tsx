"use client"

import React from "react"

import { getModules } from "@/services/messages-api"

import { ModulesTable } from "./ModulesTable"

type AllModulesProps = {
  open: boolean
  onCountReady?: (count: number) => void
}

export function AllModules(props: AllModulesProps) {
  const { open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ModulesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getModules(pageSize, lastRecord?.cursor, ascending)

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
