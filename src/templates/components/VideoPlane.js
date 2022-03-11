import React, { useRef } from 'react'

const VideoPlane = ({ src, aspectRatio, isPlaying }) => {
  const videoRef = useRef()

  const arStyle = {
    width: '1000px',
    height: '666px',
    textAlign: 'center',
    visibility: 'hidden',
    // border: '1px solid red',
  }

  return (
    <div id="ar-div" style={arStyle}>
      {!!src && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          autoPlay
          height={1000 * aspectRatio + 'px'}
          width="1000px"
          style={{ objectFit: 'cover' }}
        ></video>
      )}
    </div>
  )
}

export default VideoPlane
