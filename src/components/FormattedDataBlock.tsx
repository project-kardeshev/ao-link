import { Box, BoxProps, Typography, useTheme } from "@mui/material"
import AnsiToHtml from "ansi-to-html"
import React, { useMemo } from "react"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import lua from "react-syntax-highlighter/dist/esm/languages/hljs/lua"
import { github, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

import { MonoFontFF } from "@/components/RootLayout/fonts"

SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("lua", lua)

type FormattedDataBlockProps = BoxProps & {
  data?: string
  placeholder?: string
  isEvalMessage?: boolean
  minHeight?: number | string
}

export function FormattedDataBlock(props: FormattedDataBlockProps) {
  const { data: rawData, placeholder, isEvalMessage, minHeight = 250, ...rest } = props

  const theme = useTheme()

  const [data, type] = useMemo(() => {
    if (!rawData) return [placeholder || "...", "string"]
    if (isEvalMessage) return [rawData, "lua"]

    try {
      const json = JSON.parse(rawData)
      let formatted = JSON.stringify(json, null, 2)
      // if the json object has nested ansi strings, we strip them away
      formatted = formatted.replace(/\\u001b\[\d{1,2}(;\d{1,2})*m/g, "")
      return [formatted, "json"]
    } catch (error) {
      const ansiConverter = new AnsiToHtml()
      const formatted = ansiConverter.toHtml(rawData)
      return [formatted, "ansi"]
    }
  }, [rawData, placeholder])

  return (
    <Box
      sx={(theme) => ({
        "& *": {
          ...theme.typography.body2,
          fontFamily: MonoFontFF,
        },
        "& > *": {
          minWidth: "100%",
          minHeight: minHeight,
          height: minHeight,
          overflow: "auto",
          resize: "vertical",
          margin: 0,
          padding: "8px 16px !important",
        },
      })}
      {...rest}
    >
      {type === "string" ? (
        <Box>
          <Typography color="text.secondary" variant="inherit">
            {data}
          </Typography>
        </Box>
      ) : type === "json" ? (
        <SyntaxHighlighter
          language="json"
          style={theme.palette.mode === "light" ? github : vs2015}
          wrapLines
          wrapLongLines
        >
          {data}
        </SyntaxHighlighter>
      ) : type === "lua" ? (
        <SyntaxHighlighter
          language="lua"
          style={theme.palette.mode === "light" ? github : vs2015}
          wrapLines
          wrapLongLines
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
    </Box>
  )
}
