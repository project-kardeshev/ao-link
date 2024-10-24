import React, { memo } from "react"

import { ArnsTableRow } from "./ArnsTableRow"
import { InMemoryTable } from "@/components/InMemoryTable"
import { ArnsRecord } from "@/services/arns-api"

type BaseArnsTableProps = {
  data: ArnsRecord[]
}

function BaseArnsTable(props: BaseArnsTableProps) {
  const { data } = props

  return (
    <InMemoryTable
      initialSortField="balance"
      initialSortDir="desc"
      data={data}
      pageSize={50}
      headerCells={[
        { label: "Name", sx: { width: "33%" } },
        { label: "ANT Process Id", sx: { width: "33%" } },
        { label: "Value", sx: { width: "33%" } },
      ]}
      renderRow={(record: ArnsRecord) => <ArnsTableRow key={record.name} record={record} />}
    />
  )
}

export const ArnsTable = memo(BaseArnsTable)
