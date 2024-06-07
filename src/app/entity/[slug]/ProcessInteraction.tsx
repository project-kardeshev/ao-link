import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect/browser"
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { Asterisk } from "@phosphor-icons/react"

import { useActiveAddress } from "arweave-wallet-kit"
import React, { useCallback, useState } from "react"

import { CodeEditor } from "@/components/CodeEditor"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { truncateId } from "@/utils/data-utils"

type ProcessInteractionProps = {
  processId: string
  readOnly?: boolean
}

export function ProcessInteraction(props: ProcessInteractionProps) {
  const { processId, readOnly } = props
  const [response, setResponse] = useState("")
  const [msgId, setMsgId] = useState("")
  const [loading, setLoading] = useState(false)
  const activeAddress = useActiveAddress()

  const [query, setQuery] = useState<string | undefined>(
    JSON.stringify(
      {
        // anchor: "1234",
        // Id: "1234",
        // Owner: "placeholder",
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "Info" }],
      },
      null,
      2,
    ),
  )

  const handleFetch = useCallback(async () => {
    setLoading(true)
    setMsgId("")
    // setResponse("")
    try {
      const msg = JSON.parse(query as string) as MessageInput

      let json: DryRunResult | MessageResult | undefined

      if (readOnly) {
        json = await dryrun(msg)
      } else {
        let msgId = await message({ ...msg, signer: createDataItemSigner(window.arweaveWallet) })
        json = await result({
          message: msgId,
          process: processId,
        })
        setMsgId(msgId)
      }

      if ("Messages" in json && json.Messages.length > 0 && typeof json.Messages[0] === "object") {
        setResponse(JSON.stringify(json.Messages[0], null, 2))
      } else {
        setResponse(JSON.stringify(json, null, 2))
      }
    } catch (error) {
      setResponse(JSON.stringify({ error: `Error fetching info: ${String(error)}` }, null, 2))
    }
    setLoading(false)
  }, [processId, query, readOnly])

  return (
    <Box sx={{ marginBottom: 10 }}>
      <Stack gap={1}>
        <Stack gap={1} direction="row" height={600} sx={{ position: "relative" }}>
          <Paper
            component={CodeEditor}
            height="100%"
            width={!!response ? "50%" : "100%"}
            defaultLanguage="json"
            defaultValue={query}
            onChange={(value) => setQuery(value)}
          />
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: 0,
              right: !response ? 0 : "50%",
              border: "1px solid var(--mui-palette-divider)",
              background: "var(--mui-palette-background-paper)",
              padding: 1,
              zIndex: 9999999,
            }}
          >
            Query
          </Typography>
          {!!response && (
            <>
              <Paper
                component={CodeEditor}
                height="100%"
                width={!!response ? "50%" : "100%"}
                //
                defaultLanguage="json"
                value={response}
              />
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  border: "1px solid var(--mui-palette-divider)",
                  background: "var(--mui-palette-background-paper)",
                  padding: 1,
                  zIndex: 9999999,
                }}
              >
                Result
              </Typography>
            </>
          )}
        </Stack>
        <Grid2 container spacing={{ xs: 1, lg: 2 }}>
          <Grid2 xs={12} lg={6}></Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack direction="row" justifyContent="space-between" gap={1} alignItems={"center"}>
              {msgId ? (
                <Typography
                  variant="body2"
                  fontFamily={MonoFontFF}
                  component={Stack}
                  direction="row"
                  gap={1}
                  marginX={1}
                >
                  Message ID:
                  <IdBlock label={truncateId(msgId)} value={msgId} href={`/message/${msgId}`} />
                </Typography>
              ) : (
                <div />
              )}
              {(readOnly || activeAddress) && (
                <Button
                  size="small"
                  sx={{
                    bgcolor: "var(--mui-palette-secondary-main) !important",
                    color: "black",
                    height: "fit-content",
                  }}
                  variant="contained"
                  onClick={handleFetch}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : readOnly ? null : (
                      <Asterisk width={12} height={12} weight="bold" />
                    )
                  }
                >
                  {readOnly ? "Dry run" : "Send message"}
                </Button>
              )}
              {!readOnly && !activeAddress && (
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "var(--mui-palette-secondary-main) !important",
                    color: "black",
                    height: "fit-content",
                  }}
                  onClick={() => {
                    document.getElementById("connect-wallet-button")?.click()
                  }}
                >
                  Connect wallet
                </Button>
              )}
            </Stack>
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  )
}
