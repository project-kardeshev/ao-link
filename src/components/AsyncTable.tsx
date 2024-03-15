import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

export type HeaderCell = {
  field?: string
  sortable?: boolean
  sx?: any
  label: string
  align?: "center" | "left" | "right"
}

export type AsyncTableProps = {
  headerCells: HeaderCell[]
  pageSize: number
  renderRow: (row: any) => React.ReactNode
  initialSortField: string
  initialSortDir: "asc" | "desc"
  fetchFunction: (offset: number) => Promise<any[]>
}

export function AsyncTable(props: AsyncTableProps) {
  const {
    pageSize,
    renderRow,
    headerCells,
    initialSortField,
    initialSortDir,
    fetchFunction,
  } = props

  const loaderRef = useRef(null)
  const listSizeRef = useRef(0)
  const [data, setData] = useState<any[]>([])

  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          fetchFunction(listSizeRef.current).then((newPage) => {
            console.log(`Fetched another page of ${newPage.length} records`)

            if (newPage.length === 0) {
              console.log("No more records to fetch")
              observer.disconnect()
              setEndReached(true)
              return
            }

            setData((prevData) => {
              const newList = [...prevData, ...newPage]
              listSizeRef.current = newList.length
              return newList
            })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, endReached, pageSize])

  const [sortAscending, setSortAscending] = useState<boolean>(
    initialSortDir === "asc",
  )
  const [sortField, setSortField] = useState<string>(initialSortField)

  // const visibleRows = useMemo(
  //   () =>
  //     data
  //       .sort((a, b) => {
  //         if (a[sortField] < b[sortField]) {
  //           return sortAscending ? -1 : 1
  //         }
  //         if (a[sortField] > b[sortField]) {
  //           return sortAscending ? 1 : -1
  //         }
  //         return 0
  //       })
  //       .slice(0, listSize),
  //   [data, listSize, sortAscending, sortField],
  // )

  return (
    <Stack>
      <Table>
        <TableHead>
          <TableRow hover={false}>
            {headerCells.map((cell, index) => (
              <TableCell
                key={index}
                align={cell.align}
                sx={{
                  color: "#9ea2aa",
                  ...(cell.sx || {}),
                }}
              >
                {cell.sortable ? (
                  <TableSortLabel
                    active={sortField === cell.field}
                    direction={sortAscending ? "asc" : "desc"}
                    onClick={() => {
                      if (sortField !== cell.field) {
                        setSortField(cell.field as string)
                      } else {
                        setSortAscending(!sortAscending)
                      }
                    }}
                  >
                    {cell.label}
                  </TableSortLabel>
                ) : (
                  cell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(renderRow)}
          {data.length === 0 && endReached && (
            <TableRow hover={false}>
              <TableCell colSpan={99} sx={{ padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No data available.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Stack
        marginY={1.5}
        marginX={2}
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
