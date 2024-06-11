"use client"

import React from "react"

import { getBlocks } from "@/services/blocks-api"

import { BlocksTable } from "./BlocksTable"

type Props = {
  open: boolean
}

export function AllBlocks(props: Props) {
  const { open } = props

  if (!open) return null

  const pageSize = 25

  return (
    <BlocksTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const records = await getBlocks(pageSize, lastRecord?.cursor, ascending)
        return records
      }}
    />
  )
}
