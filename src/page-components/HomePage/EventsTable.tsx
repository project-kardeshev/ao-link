"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"

import { type AoEvent, subscribeToEvents } from "@/services/aoscan"
import {
  type NormalizedAoEvent,
  normalizeAoEvent,
} from "@/utils/ao-event-utils"

import { truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"
import { Loader } from "../../components/Loader"

type EventTablesProps = {
  initialData: NormalizedAoEvent[]
  blockHeight?: number
  pageLimit?: number
}

const EventsTable = (props: EventTablesProps) => {
  const { initialData, blockHeight, pageLimit } = props

  const [data, setData] = useState<NormalizedAoEvent[]>(initialData)

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      if (event.height !== blockHeight) return

      console.log("📜 LOG > unsubscribe > event:", event)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)

        if (pageLimit === undefined) {
          return [parsed, ...prevData]
        }

        return [parsed, ...prevData.slice(0, pageLimit - 1)]
      })
    })

    return unsubscribe
  }, [blockHeight, pageLimit])

  return (
    <>
      {data.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2 w-[160px]">Action</th>
                <th className="text-start p-2 w-[180px]">Message ID</th>
                <th className="text-start p-2 w-[180px]">Process ID</th>
                <th className="text-start p-2 w-[180px]">Owner</th>
                {!blockHeight && (
                  <th className="text-start p-2">Block Height</th>
                )}
                <th className="text-start p-2">Scheduler ID</th>
                <th className="text-start p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  className="table-row"
                  key={item.id}
                  // onClick={() => {
                  //   router.push(
                  //     item.type === "Message"
                  //       ? `/message/${item.id}`
                  //       : `/process/${item.id}`,
                  //   )
                  // }}
                >
                  <td className="text-start p-2">
                    <div
                      className={`gap-2 inline-flex px-2 py-1 ${
                        item.type === "Process"
                          ? "bg-[#FEEEE5]"
                          : "bg-[#E2F0DC]"
                      }`}
                    >
                      <p className="uppercase">{item.type}</p>
                      <Image
                        alt="icon"
                        width={8}
                        height={8}
                        src={
                          item.type === "Process"
                            ? "/process.svg"
                            : "/message.svg"
                        }
                      />
                    </div>
                  </td>
                  <td className="text-start p-2 ">{item.action}</td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      value={item.messageId}
                      href={`/message/${item.messageId}`}
                    />
                  </td>
                  <td className="text-start p-2">
                    <IdBlock
                      value={item.processId}
                      href={`/process/${item.processId}`}
                    />
                  </td>
                  <td className="text-start p-2 ">
                    <IdBlock value={item.owner} />
                  </td>
                  {!blockHeight && (
                    <td className="text-start p-2 ">
                      <Link href={`/block/${item.blockHeight}`}>
                        <span className="hover:underline">
                          {formatNumber(item.blockHeight)}
                        </span>
                      </Link>
                    </td>
                  )}
                  <td className="text-start p-2 ">
                    {truncateId(item.schedulerId)}
                  </td>
                  <td className="text-start p-2">
                    <span
                      className="tooltip"
                      data-tip={formatFullDate(item.created)}
                    >
                      {formatRelative(item.created)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default EventsTable
