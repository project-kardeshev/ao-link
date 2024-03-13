import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

import { MainFontFF } from "./fonts"

export const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "rgb(220,220,220)",
        },
        secondary: {
          main: "rgb(200,200,200)",
        },
        // @ts-ignore
        accent: {
          main: "rgba(41, 204, 0, 1)",
        },
        background: {
          paper: "#252424",
          default: "rgb(24, 25, 26)",
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: "rgb(50, 50, 50)",
        },
        secondary: {
          main: "rgb(230, 230, 230)",
        },
        // @ts-ignore
        accent: {
          main: "rgba(41, 204, 0, 1)",
        },
        background: {
          default: "rgb(255,255,255)",
          paper: "#f9f9f9",
        },
        text: {
          secondary: "#9EA2AA",
        },
      },
    },
  },
  typography: {
    fontFamily: MainFontFF,
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        placement: "top",
        disableInteractive: true,
        enterDelay: 0,
        leaveDelay: 0,
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: "0.9rem",
          textAlign: "center",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // textTransform: "none",
          boxShadow: "none !important",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px 8px !important",
          minHeight: "unset !important",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "unset !important",
          marginTop: "-12px",
          marginLeft: "-8px",
        },
        flexContainer: {
          gap: "16px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
})
