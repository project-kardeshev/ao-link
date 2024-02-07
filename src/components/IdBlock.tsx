"use client"

import Link from "next/link"
import React from "react"

import { truncateId } from "@/utils/data-utils"

import { CopyToClipboard } from "./CopyToClipboard"

type IdBlockProps = {
  value: string
  href?: string
}

export function IdBlock(props: IdBlockProps) {
  const { value, href } = props

  if (href) {
    return (
      <div className="fill-[#7d7d7d00] hover:fill-[#7d7d7d]">
        <Link href={href}>
          <span className="tooltip hover:underline" data-tip={value}>
            {truncateId(value)}
          </span>
        </Link>
        <CopyToClipboard value={value} />
      </div>
    )
  }

  return (
    <div className="fill-[#7d7d7d00] hover:fill-[#7d7d7d]">
      <span className="tooltip" data-tip={value}>
        {truncateId(value)}
      </span>
      <CopyToClipboard value={value} />
    </div>
  )
}
