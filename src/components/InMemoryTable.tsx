import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

export type HeaderCell = {
  sx?: any
  label: string
  align?: "center" | "left" | "right"
}

type InMemoryTableProps = {
  headerCells: HeaderCell[]
  data: any[]
  /**
   * @default 30
   */
  pageSize?: number
  renderRow: (row: any) => React.ReactNode
}

export function InMemoryTable(props: InMemoryTableProps) {
  const { data, pageSize = 30, renderRow, headerCells } = props

  const loaderRef = useRef(null)

  const [listSize, setListSize] = useState(pageSize)
  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Showing more data")
          setListSize((prev) => {
            if (prev + pageSize >= data.length) {
              setEndReached(true)
              return data.length
            }
            return prev + pageSize
          })
        } else {
          console.log("Not intersecting")
        }
      },
      { threshold: 1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Stack>
      <Table>
        <TableHead>
          <TableRow>
            {headerCells.map((cell, index) => (
              <TableCell
                key={index}
                align={cell.align}
                sx={{
                  color: "#9ea2aa",
                  ...(cell.sx || {}),
                }}
              >
                {cell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{data.slice(0, listSize).map(renderRow)}</TableBody>
      </Table>
      <Stack
        marginY={2}
        marginX={1}
        ref={loaderRef}
        sx={{ width: "100%" }}
        direction="row"
        gap={1}
        alignItems="center"
        // justifyContent="center"
      >
        {!endReached && <CircularProgress size={12} color="primary" />}
        <Typography variant="body2" color="text.secondary">
          {endReached
            ? `Total rows: ${data.length}`
            : "Loading more records..."}
        </Typography>
      </Stack>
    </Stack>
  )
}
