import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Typography,
} from '@mui/material'
import { CameraAlt, Clear } from '@mui/icons-material'

import LoadingScreen from 'components/LoadingScreen'
import NotFoundPage from 'pages/NotFoundPage/NotFoundPage'
import NoMatch from 'components/NoMatch'
import ProfileLoading from './components/PortalLoading'
import { useParams } from 'react-router'
import usePortalStore from 'hooks/store/use-portal-store'
import ScanError from 'components/ScanError'
import { useHistory } from 'react-router-dom'
import Pack from 'components/Pack'
import useScanStore from 'hooks/store/use-scan-store'
import PortalCamera from './components/PortalCamera'
import usePageTrack from 'hooks/use-page-track'
import useAlertStore from 'hooks/store/use-alert-store'
import PortalFull from './components/PortalFull'
import { useFetch } from 'hooks/use-fetch'
import ARPack from 'pages/ViewPack/components/ARPack'
import Div100vh from 'components/Div100vh'

import Webcam from 'react-webcam'

const Project = () => {
  const {
    portalUser,
    scanCount,
    status: portalStatus,
    fetchPortal,
    setCameraError,
  } = usePortalStore()
  const { foundPack, error, status: scanStatus } = useScanStore()

  useFetch()
  usePageTrack()

  const { error: alertError, clearError } = useAlertStore()

  useEffect(() => {
    if (alertError) {
    }
  }, [alertError, clearError])

  const { username } = useParams()

  useEffect(() => {
    const fetchPortalUser = async () => {
      try {
        await fetchPortal(username)
      } catch (err) {
        clearError()
      }
    }

    if (!portalUser || portalUser.username !== username) {
      fetchPortalUser()
    } else {
      window.history.replaceState(null, null, `/${username}/open`)
    }
  }, [portalUser, fetchPortal, username, clearError])

  const { portal } = portalUser || {}
  const { style, instructions } = portal || {}
  const { fontColor, backgroundColor } = style || {}

  const history = useHistory()

  const handleClose = () => {
    history.push(`/${portalUser.username}`)
  }

  const [hasUserMedia, setHasUserMedia] = useState(false)

  const handleUserMedia = () => {
    setCameraError(false)
    setHasUserMedia(true)
  }

  const handleUserMediaError = () => {
    history.push(`/${portalUser.username}`)
    setCameraError(true)
  }

  const { startScan } = useScanStore()

  const videoConstraints = {
    facingMode: 'environment',
  }

  const webcamRef = useRef(null)

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot()

    try {
      await startScan(imageSrc, username)
    } catch (err) {
      clearError()
    }
  }, [webcamRef, startScan, clearError, username])

  return (
    <Div100vh width="100vw">
      <Box position="absolute" zIndex="0" width="100%" height="100%">
        <>
          <Box
            display="flex"
            position="fixed"
            zIndex="10"
            bottom={16}
            width="100%"
            justifyContent="center"
          >
            <Grid container justifyContent="center" spacing={1}>
              {hasUserMedia ? (
                <>
                  <Grid item xs={11}>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      color="white"
                      sx={{ textShadow: '0px 1px 7px #555555' }}
                    >
                      <b>
                        {instructions || `Snap a photo to unlock your content`}
                      </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="center">
                    <Fab
                      onClick={capture}
                      variant="outlined"
                      aria-label="Take photo"
                    >
                      <CameraAlt fontSize="large" />
                    </Fab>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} container justifyContent="center">
                  <CircularProgress sx={{ color: 'white' }} />
                </Grid>
              )}
            </Grid>
          </Box>
          <Box
            display="flex"
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            zIndex="5"
          >
            <Box
              bottom="auto"
              position="absolute"
              top="0"
              display="flex"
              justifyContent="flex-end"
              paddingBottom="0.25rem"
              left="0"
              right="0"
              zIndex="5"
              pt={1}
              pr={1}
            >
              <Button
                onClick={handleClose}
                size="small"
                color="inherit"
                disableRipple
                endIcon={<Clear sx={{ color: '#ffffff' }} aria-label="Close" />}
              >
                <Box color={'#ffffff'}>Close</Box>
              </Button>
            </Box>
            <Box
              bottom="0"
              position="absolute"
              top="auto"
              display="flex"
              justifyContent="flex-end"
              paddingBottom="0.25rem"
              left="0"
              right="0"
              zIndex="5"
              pt={1}
              pr={1}
            >
              {hasUserMedia && (
                <Grid container justifyContent="center">
                  <Grid item xs={11}>
                    {/* <Typography
                      variant="h6"
                      textAlign="center"
                      color={fontColor}
                      sx={{ textShadow: '0px 1px 7px #555555' }}
                    >
                      <b>
                        {instructions || `Snap a photo to unlock your content`}
                      </b>
                    </Typography> */}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
          <Box
            height="100%"
            maxWidth="100%"
            display="flex"
            justifyContent="center"
            overflow="hidden"
          >
            <Webcam
              audio={false}
              height="100%"
              screenshotFormat="image/jpeg"
              ref={webcamRef}
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
            />
          </Box>
        </>
      </Box>
    </Div100vh>
  )
}

export default Project
