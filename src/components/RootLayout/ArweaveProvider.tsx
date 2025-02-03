import { useColorScheme } from "@mui/material"
import { AOWalletKit } from "@project-kardeshev/ao-wallet-kit"
import React from "react"

import { MainFontFF } from "./fonts"

export function ArweaveProvider({ children }: { children: React.ReactNode }) {
  const { mode = "dark" } = useColorScheme()

  return (
    <AOWalletKit
      theme={{
        displayTheme: mode === "dark" ? "dark" : "light",
        font: {
          fontFamily: MainFontFF,
        },
        radius: "none",
        accent: {
          r: 76,
          g: 175,
          b: 81,
        },
      }}
      config={{
        appInfo: {
          name: "AoLink",
        },
        permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
        ensurePermissions: true,
      }}
    >
      {children}
    </AOWalletKit>
  )
}
