import React, { type HTMLProps } from "react"

import { cn } from "@/utils/tailwind-utils"

export function Chip({ className, ...rest }: HTMLProps<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        className,
        `m-1 inline-block px-3 py-1 rounded-full text-[#5d5d5d]`,
      )}
      {...rest}
    />
  )
}
