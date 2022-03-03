import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto'
  },
  palette: {
    type: 'light',
    primary: {
      main: '#00693e',
    },
    secondary: {
      main: '#12312b',
    },
    info: {
      main: '#9bc8eb',
    },
  },
});

export default theme;
