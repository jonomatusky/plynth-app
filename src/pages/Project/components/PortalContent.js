import React, { useState } from 'react'
import { Grid, Typography, Box, Button, Link } from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import Div100vh from 'components/Div100vh'

const PortalContent = ({ portal, onOpenCamera, showHelpDialog }) => {
  const [imageIsLoaded, setImageIsLoaded] = useState(false)

  const { title, text, style, image, imageUrl, hideBranding } = portal || {}
  let { font, fontColor, backgroundColor, buttonColor } = style || {}

  console.log(portal)
  console.log(style)

  return (
    <>
      <Div100vh
        width="100%"
        display="flex"
        alignItems="center"
        position="absolute"
        zIndex="20"
        backgroundColor={backgroundColor || '#ffffff'}
      >
        <Grid container justifyContent="center" textAlign="center">
          {image && (
            <Grid item xs={12} container justifyContent="center">
              <>
                <img
                  alt="Logo"
                  onClick={onOpenCamera}
                  src={imageUrl}
                  style={{
                    width: '150px',
                    height: '150px',
                    display: imageIsLoaded ? null : 'none',
                    marginBottom: '10px',
                  }}
                  onLoad={() => setImageIsLoaded(true)}
                />
                {!imageIsLoaded && (
                  <Box height="150px" width="150px" mb="10px" />
                )}
              </>
            </Grid>
          )}
          {title && (
            <Grid item xs={10}>
              <Box color={fontColor || '#000000'}>
                <Typography textAlign="center" fontFamily={font} variant="h5">
                  <b>{title}</b>
                </Typography>
              </Box>
            </Grid>
          )}
          {text && (
            <Grid item xs={10}>
              <Box color={fontColor || '#000000'} pb={2}>
                <Typography textAlign="center" fontFamily={font}>
                  {text || `Snap a photo to access your content`}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              onClick={onOpenCamera}
              endIcon={
                <CameraAlt style={{ color: buttonColor || '#000000' }} />
              }
              disableRipple
              sx={{
                borderBottom: `2px solid ${buttonColor || '#000000'}`,
                borderRadius: '0px',
                ':hover': {
                  borderBottom: `2px solid ${buttonColor || '#000000'}`,
                  backgroundColor: '#00000000',
                },
                ':focus': {
                  borderBottom: `2px solid ${buttonColor || '#000000'}`,
                },
              }}
            >
              <Box color={buttonColor || '#000000'}>
                <Typography fontFamily={font} variant="h6">
                  <b>Open Camera</b>
                </Typography>
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Div100vh>
      <Box
        bottom="0"
        position="absolute"
        top="auto"
        display="flex"
        justifyContent="center"
        paddingBottom="0.25rem"
        left="0"
        right="0"
        zIndex="30"
      >
        <Grid container justifyContent="center">
          {!hideBranding && (
            <Grid item xs={12} container justifyContent="center">
              <Box
                color={fontColor || '#000000'}
                sx={{
                  opacity: '0.6',
                  // '&:hover': {
                  //   opacity: '0.6',
                  // },
                }}
              >
                <Typography variant="subtitle2">
                  <Link
                    href="/"
                    color="inherit"
                    underline="always"
                    target="_blank"
                  >
                    Powered by Plynth
                  </Link>
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} container justifyContent="center">
            <Button
              onClick={showHelpDialog}
              size="small"
              disableRipple
              color="secondary"
            >
              <Box color={fontColor || '#000000'} fontSize={12}>
                Having Trouble?
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PortalContent
