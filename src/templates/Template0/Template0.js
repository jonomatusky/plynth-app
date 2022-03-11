import React, { useEffect, useRef, useState } from 'react'
import Div100vh from 'components/Div100vh'
import { CSS3DObject } from 'util/CSS3DRenderer'
import BrandingBar from 'templates/components/BrandingBar'
import { Reticle, ReticleLoading } from '../components/Reticle'
import SoundButton from 'templates/components/SoundButton'

const Template0 = ({ experience }) => {
  const videoRef = useRef()

  const object = (experience.objects || [])[0]
  const { assetUrl: src, height, unLoop, unMuted, unAutoPlay } = object || {}
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
    console.log(isMuted)
  }

  useEffect(() => {
    const targetFound = () => {
      console.log('targetFound')
      setIsFound(true)
      play()
    }

    const targetLost = () => {
      console.log('targetLost')
      setIsFound(false)
      pause()
    }

    const initMindAR = async () => {
      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector('#container'),
        imageTargetSrc:
          'https://plynth-barebones.s3.us-east-2.amazonaws.com/a9664331-19a2-4f82-8441-790ac8da8bc2.mind ',
        filterMinCF: 0.001,
        filterBeta: 10000,
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

    initMindAR()
  }, [])

  const containerStyle = {
    height: '100%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  const arStyle = {
    width: '1000px',
    height: '666px',
    textAlign: 'center',
    visibility: 'hidden',
  }

  return (
    <>
      <Reticle />
      <ReticleLoading />
      <BrandingBar />
      {isFound && <SoundButton isMuted={isMuted} toggleMute={toggleMute} />}
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
              height={1000 * height + 'px'}
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
