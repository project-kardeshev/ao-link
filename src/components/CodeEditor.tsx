import { Editor, EditorProps, Monaco, useMonaco } from "@monaco-editor/react"
import { CircularProgress, Paper, Stack, useTheme } from "@mui/material"
import React, { useCallback, useEffect } from "react"

export function CodeEditor(props: EditorProps) {
  const monaco = useMonaco()
  const theme = useTheme()

  const setCustomTheme = useCallback(
    (editor: any, monaco: Monaco) => {
      monaco.editor.defineTheme("ao-link", {
        base: theme.palette.mode === "dark" ? "vs-dark" : "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": theme.palette.background.paper,
        },
      })
      monaco.editor.setTheme("ao-link")
    },
    [theme.palette.background.paper, theme.palette.mode],
  )

  useEffect(() => {
    if (!monaco) return
    setCustomTheme(undefined, monaco)
  }, [monaco, setCustomTheme])

  return (
    <Editor
      defaultLanguage="json"
      onMount={setCustomTheme}
      loading={
        <Paper sx={{ width: "100%", height: "100%" }}>
          <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
            <CircularProgress size={24} color="primary" />
          </Stack>
        </Paper>
      }
      options={{
        minimap: { enabled: false },
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        overviewRulerLanes: 0,
      }}
      {...props}
    />
  )
}
