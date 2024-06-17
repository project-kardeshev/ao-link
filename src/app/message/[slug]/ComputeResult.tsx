"use client"

import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { result } from "@permaweb/aoconnect/browser"
import { Asterisk } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"

type ComputeResultProps = {
  messageId: string
  processId: string
}

export function ComputeResult(props: ComputeResultProps) {
  const { messageId, processId } = props
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const [msg, setMsg] = React.useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!processId) return

    getMessageById(processId).then(setMsg)
  }, [processId])

  const handleCompute = useCallback(async () => {
    setLoading(true)
    try {
      const json = await result({
        message: messageId,
        process: processId,
      })
      console.log("📜 LOG > handleCompute > json:", json)

      setContent(JSON.stringify(json, null, 2))
    } catch (error) {
      setContent(String(error))
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [messageId, processId])

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Compute Result
        </Typography>
        <Button
          size="small"
          sx={{
            bgcolor: "var(--mui-palette-secondary-main) !important",
            color: "black",
            height: "fit-content",
          }}
          variant="contained"
          onClick={handleCompute}
          disabled={!msg || loading}
          endIcon={
            loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <Asterisk width={12} height={12} weight="bold" />
            )
          }
        >
          Compute
        </Button>
      </Stack>
      <TextField
        sx={(theme) => ({
          bgcolor: "var(--mui-palette-background-paper)",
          "& textarea": {
            ...theme.typography.body2,
            fontFamily: MonoFontFF,
            resize: "both",
            minWidth: "100%",
            minHeight: 200,
          },
        })}
        rows={1}
        multiline
        variant="outlined"
        placeholder={
          msg === undefined
            ? "There is no result to compute because the message was sent to a User."
            : loading
              ? "Loading..."
              : "Click 'Compute' to get the result."
        }
        value={content
          ?.replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\u001b\[\d{1,2}(;\d{1,2})*m/g, "")}
      />
    </Stack>
  )
}
