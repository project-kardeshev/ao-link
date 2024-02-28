"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import Mixpanel from "@/components/Mixpanel"

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    Mixpanel.track("Page View", {
      url: url,
    })
    // You can now use the current URL
    // ...
  }, [pathname, searchParams])

  return null
}
