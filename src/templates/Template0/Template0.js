import React, { useEffect, useRef, useState } from 'react'
import { Box, Button } from '@mui/material'
import Div100vh from 'components/Div100vh'
import { CSS3DObject } from 'util/CSS3DRenderer'
import BrandingBar from 'templates/components/BrandingBar'
import { Reticle, ReticleLoading } from '../components/Reticle'
import SoundButton from 'templates/components/SoundButton'

const Template0 = ({ experience }) => {
  const videoRef = useRef()

  const { objects, links, targetUrl, hideLinks } = experience || {}
  const object = (objects || [])[0]
  const link = (links || [])[0]
  const {
    assetUrl: src,
    height,
    width,
    unLoop,
    unMuted,
    unAutoPlay,
  } = object || {}
  const { url, label, color, fontColor } = link || {}
  // const button = (experience.links || [])[0]

  const [isFound, setIsFound] = useState(false)
  const [isMuted, setIsMuted] = useState(!unMuted)

  const play = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const pause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const toggleMute = () => {
    videoRef.current.muted = !isMuted

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
        // filterMinCF: 0.001,
        // filterBeta: 10000,
        uiScanning: '#reticle',
        uiLoading: '#reticle-loading',
      })
      const { renderer, cssRenderer, cssScene, camera } = mindarThree

      const obj = new CSS3DObject(document.querySelector('#ar-div'))
      const cssAnchor = mindarThree.addCSSAnchor(0)
      cssAnchor.onTargetFound = targetFound
      cssAnchor.onTargetLost = targetLost
      cssAnchor.group.add(obj)

      await mindarThree.start()
      renderer.setAnimationLoop(() => {
        cssRenderer.render(cssScene, camera)
      })
    }

    if (targetUrl) {
      initMindAR()
    }
  }, [targetUrl])

  const containerStyle = {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  const arStyle = {
    width: '1000px',
    height: 1000 * (height / width) + 'px',
    textAlign: 'center',
    visibility: 'hidden',
  }

  return (
    <>
      <Reticle />
      <ReticleLoading />
      {isFound && (
        <>
          <SoundButton isMuted={isMuted} toggleMute={toggleMute} />
          {!!url && !hideLinks && (
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
        </>
      )}
      <BrandingBar />
      <Div100vh width="100%" overflow="hidden">
        <div id="container" style={containerStyle}></div>
        <div id="ar-div" style={arStyle}>
          {!!src && (
            <video
              ref={videoRef}
              src={src}
              loop={!unLoop}
              muted={!unMuted}
              autoPlay={!unAutoPlay}
              height={1000 * (height / width) + 'px'}
              width="1000px"
              style={{ objectFit: 'cover' }}
              playsInline
            ></video>
          )}
        </div>
      </Div100vh>
    </>
  )
}

export default Template0
