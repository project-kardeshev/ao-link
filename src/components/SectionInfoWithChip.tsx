import React from "react"

import { TYPE_COLOR_MAP } from "@/utils/data-utils"

import { Asterisk } from "./icons/Asterisk"
import { Diamonds } from "./icons/Diamonds"

export const SectionInfoWithChip = ({
  title,
  value,
}: {
  title: string
  value: string
}) => (
  <div className="flex flex-row items-baseline w-full">
    <div className="flex w-56 items-center">
      <p className="table-headers">{title}</p>
    </div>
    <div
      className={`flex min-w-[70px] py-1 px-2 space-x-1 items-center ${
        value.toLocaleLowerCase() === "process"
          ? TYPE_COLOR_MAP["Process"]
          : TYPE_COLOR_MAP["Message"]
      }`}
    >
      <p className="table-row hover:bg-transparent !h-auto">{value}</p>
      {value.toLocaleLowerCase() === "process" ? <Diamonds /> : <Asterisk />}
    </div>
  </div>
)
