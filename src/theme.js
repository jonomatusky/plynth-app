import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    secondary: { main: '#666666' },
    error: { main: '#FF9516' },
    background: {
      card: '#212421',
    },
  },
  typography: {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
    h5: {
      lineHeight: '1.5',
    },
    h6: {
      lineHeight: '1.25',
    },
  },
})

export default theme
