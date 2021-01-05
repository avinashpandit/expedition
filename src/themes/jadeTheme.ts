import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

export const lightTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        background: "#fff !important",
      },
    },
    MuiPaper: {
      root: {
        overflow: "visible !important",
      },
    },
    MuiTableHead:{
      root: {
        background: grey[200],
      },
    },
  },
  palette: {
    background: {
      default: "#fff",
    },
  },
}));

export const darkTheme = responsiveFontSizes(createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  palette: {
    type: "dark",
    background: {
      default: grey[900],
      paper: grey[800],
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        overflow: "visible !important",
      },
    },
    MuiTable: {
      root: {
        background: "transparent !important",
        tableLayout: 'auto',
      },
    },
    MuiTypography: {
      root: {
        color: grey[400],
      },
    },
    MuiCardContent: {
      root: {
        paddingBottom: 0,
        "&:last-child": {
          paddingBottom: 0
        },
      },
    },
    MuiTableHead:{
      root: {
        background: grey[800],
      },
    },
  },
}));

export default {
  darkTheme,
  lightTheme,
};
