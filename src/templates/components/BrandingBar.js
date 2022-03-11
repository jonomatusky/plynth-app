import { Link, Typography } from '@mui/material'

const BrandingBar = () => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        textAlign: 'center',
        color: 'white',
        paddingTop: '5px',
        paddingBottom: '5px',
        position: 'absolute',
        zIndex: 2000,
        backgroundColor: '#2b2b2b',
        fontSize: '12px',
      }}
    >
      <Typography color="inherit" variant="body2">
        <Link href="https://plynth.com" target="_blank" color="inherit">
          Powered by Plynth
        </Link>
      </Typography>
    </div>
  )
}

export default BrandingBar
