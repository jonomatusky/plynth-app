import React, { useEffect, useRef, useState } from 'react'
import { Box, Button } from '@mui/material'
import ReactPlayer from 'react-player'
import Div100vh from 'components/Div100vh'
import { CSS3DObject } from 'util/CSS3DRenderer'
import BrandingBar from 'templates/components/BrandingBar'
import { Reticle, ReticleLoading } from '../components/Reticle'
import SoundButton from 'templates/components/SoundButton'
import ErrorDialog from './components/ErrorDialog'
// import { useRequest } from 'hooks/use-request'

const Template0 = ({ experience }) => {
  const videoRef = useRef()

  const {
    objects,
    links,
    targetUrl,
    hideLinks,
    showLinksImmediately,
    filterMinCF,
    filterBeta,
  } = experience || {}
  const object = (objects || [])[0]
  const link = (links || [])[0]
  const {
    assetType: videoType,
    assetUrl: src,
    height,
    width,
    unLoop,
    unMuted,
    // unAutoPlay,
  } = object || {}
  const { url, label, color, fontColor } = link || {}
  // const button = (experience.links || [])[0]

  const [isFound, setIsFound] = useState(false)
  const [isMuted, setIsMuted] = useState(!unMuted)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ErrorDialogOpen, setErrorDialogOpen] = useState(false)

  const play = () => {
    // if using html5 video
    if (videoRef.current) {
      videoRef.current.play()
    }

    // if using react-player
    setIsPlaying(true)
  }

  const pause = () => {
    // if using html5 video
    if (videoRef.current) {
      videoRef.current.pause()
    }

    //if using react-player
    setIsPlaying(false)
  }

  const toggleMute = () => {
    // if using html5 video
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }

    // if using react-player (determines button state either way)
    setIsMuted(!isMuted)
  }

  useEffect(() => {
    const targetFound = () => {
      setIsFound(true)
      play()
    }

    const targetLost = () => {
      setIsFound(false)
      pause()
    }

    const initMindAR = async () => {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector('#container'),
        imageTargetSrc: targetUrl,
        filterMinCF: filterMinCF || 0.0001,
        filterBeta: filterBeta || 10000,
        uiScanning: '#reticle',
        uiLoading: '#reticle-loading',
      })
      const { renderer, cssRenderer, cssScene, camera } = mindarThree

      const obj = new CSS3DObject(document.querySelector('#ar-div'))
      const cssAnchor = mindarThree.addCSSAnchor(0)
      cssAnchor.onTargetFound = targetFound
      cssAnchor.onTargetLost = targetLost
      cssAnchor.group.add(obj)

      try {
        await mindarThree.start()
        renderer.setAnimationLoop(() => {
          cssRenderer.render(cssScene, camera)
        })
      } catch (err) {
        setErrorDialogOpen(true)
      }
    }

    if (targetUrl) {
      initMindAR()
    }
  }, [targetUrl, filterMinCF, filterBeta])

  const containerStyle = {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  const arStyle = {
    width: '1010px',
    height: 1010 * (height / width) + 'px',
    textAlign: 'center',
    visibility: 'hidden',
  }

  // const [youtubeDimensions, setYoutubeDimensions] = useState(null)

  // const { request } = useRequest()
  // useEffect(() => {
  //   const getYoutubeDimensions = async () => {
  //     try {
  //       const data = await request({
  //         url: `https://www.youtube.com/oembed?url=${src}&format=json`,
  //       })

  //       const { height, width } = data || {}

  //       if (height && width) {
  //         setYoutubeDimensions({ height, width })
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   if (videoType === 'youtube') {
  //     getYoutubeDimensions()
  //   }
  // }, [videoType, src, request])

  return (
    <>
      <ErrorDialog open={ErrorDialogOpen} />
      <Reticle />
      <ReticleLoading />
      {isFound && <SoundButton isMuted={isMuted} toggleMute={toggleMute} />}
      {!!url && !hideLinks && (isFound || showLinksImmediately) && (
        <Box
          position="absolute"
          bottom="50px"
          width="100%"
          textAlign="center"
          zIndex={3000}
        >
          <Button
            variant="contained"
            // disableElevation
            href={url}
            sx={{
              borderRadius: '50px',
              color: fontColor,
              backgroundColor: color || '#000',
              '&:hover': {
                backgroundColor: color || '#000',
                boxShadow: `0px 1px #000`,
              },
            }}
          >
            {label || 'Learn More'}
          </Button>
        </Box>
      )}
      <BrandingBar />
      <Div100vh width="100%" overflow="hidden">
        <div id="container" style={containerStyle}></div>
        <div id="ar-div" style={arStyle}>
          {!!src && (
            <>
              {videoType === 'videoFile' ? (
                <video
                  ref={videoRef}
                  src={src}
                  loop={!unLoop}
                  muted={isMuted}
                  height="100%"
                  width="100%"
                  style={{ objectFit: 'cover' }}
                  playsInline
                  preload="auto"
                />
              ) : (
                <Box
                  height={1010 * (height / width) + 'px'}
                  width="1010px"
                  textAlign="center"
                  overflow="hidden"
                  // position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <ReactPlayer
                    // style={{ position: 'absolute', objectFit: 'cover' }}
                    // onReady={player => console.log(player)}
                    playing={isPlaying}
                    url={src}
                    loop={!unLoop}
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    // width={
                    //   !!youtubeDimensions
                    //     ? Math.max(
                    //         1000,
                    //         (1000 / (width / height)) *
                    //           (youtubeDimensions.width /
                    //             youtubeDimensions.height)
                    //       ) + 'px'
                    //     : '100%'
                    // }
                    width="100%"
                    // height={
                    //   !!youtubeDimensions
                    //     ? Math.max(
                    //         1000 / (width / height),
                    //         1000 /
                    //           (youtubeDimensions.width /
                    //             youtubeDimensions.height)
                    //       ) + 'px'
                    //     : '100%'
                    // }
                    height="100%"
                  />
                </Box>
              )}
            </>
          )}
        </div>
      </Div100vh>
    </>
  )
}

export default Template0
