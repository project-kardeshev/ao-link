import { Paper, Stack, Typography, useTheme } from "@mui/material"
import AnsiToHtml from "ansi-to-html"
import React, { useEffect, useState } from "react"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import { github, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { AoMessage } from "@/types"

SyntaxHighlighter.registerLanguage("json", json)

export function MessageData(props: { message: AoMessage }) {
  const { message } = props

  const [type, setType] = useState<"json" | "ansi">("json")
  const [data, setData] = useState<string>("")

  useEffect(() => {
    if (!message) return

    if (message.type === "Checkpoint") {
      setData("Message too long")
    } else {
      fetch(`https://arweave.net/${message.id}`)
        .then((res) => res.text())
        .then((text) => {
          try {
            const json = JSON.parse(text)
            const formatted = JSON.stringify(json, null, 2)
            setData(formatted)
            setType("json")
          } catch (error) {
            const ansiConverter = new AnsiToHtml()
            const htmlString = ansiConverter.toHtml(text)
            setData(htmlString)
            setType("ansi")
          }
        })
    }
  }, [message])

  const theme = useTheme()

  return (
    <Stack gap={1} justifyContent="stretch">
      <Typography variant="subtitle2" color="text.secondary">
        Data
      </Typography>
      <Paper
        sx={(theme) => ({
          bgcolor: "var(--mui-palette-background-paper)",
          "& *": {
            ...theme.typography.body2,
            fontFamily: MonoFontFF,
          },
          "& > *": {
            minWidth: "100%",
            minHeight: 200,
            height: 400,
            resize: "vertical",
            margin: 0,
            padding: "8px !important",
          },
        })}
      >
        {type === "json" ? (
          <SyntaxHighlighter
            language="json"
            style={theme.palette.mode === "light" ? github : vs2015}
          >
            {data}
          </SyntaxHighlighter>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: data,
            }}
          />
        )}
      </Paper>
    </Stack>
  )
}
