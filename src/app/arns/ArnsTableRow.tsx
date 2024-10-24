import { Skeleton, TableCell, TableRow, Typography } from "@mui/material"

import { useQuery } from "@tanstack/react-query"

import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { ArnsRecord, getRecordValue } from "@/services/arns-api"

type ArnsTableRowProps = {
  record: ArnsRecord
}

export function ArnsTableRow(props: ArnsTableRowProps) {
  const { record } = props

  const { data: recordValue, isLoading } = useQuery({
    queryKey: ["record-value", record.name],
    queryFn: async () => {
      const results = await getRecordValue(record.processId)
      return results
    },
  })

  return (
    <TableRow key={record.name}>
      <TableCell>
        <Typography fontFamily={MonoFontFF} variant="inherit" component="div">
          <IdBlock label={record.name} value={record.name} />
        </Typography>
      </TableCell>
      <TableCell>
        <EntityBlock entityId={record.processId} fullId skipQuery />
      </TableCell>
      <TableCell>{isLoading ? <Skeleton /> : recordValue?.transactionId}</TableCell>
    </TableRow>
  )
}
