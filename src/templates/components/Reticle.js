import React from 'react'
import ScanInstructions from 'assets/images/scan-instruction.svg'
import { CircularProgress } from '@mui/material'
import './Reticle.css'

const ReticleInner = ({ children }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            width: '80vw',
            height: '90vw',
            opacity: '0.8',
            background:
              'linear-gradient(to right, #fff 5px, transparent 5px) 0 0, linear-gradient(to right, #fff 5px, transparent 5px) 0 100%, linear-gradient(to left, #fff 5px, transparent 5px) 100% 0, linear-gradient(to left, #fff 5px, transparent 5px) 100% 100%, linear-gradient(to bottom, #fff 5px, transparent 5px) 0 0, linear-gradient(to bottom, #fff 5px, transparent 5px) 100% 0, linear-gradient(to top, #fff 5px, transparent 5px) 0 100%, linear-gradient(to top, #fff 5px, transparent 5px) 100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '40px 40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export const Reticle = () => {
  return (
    <div
      id="reticle"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 30,
        left: 0,
        right: 0,
        zIndex: 2,
        // display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      }}
      className="hidden"
    >
      <ReticleInner>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '1rem',
            height: '110px',
          }}
        >
          <img
            src={ScanInstructions}
            style={{ width: '156px' }}
            alt="Scan Instructions"
          />
        </div>
      </ReticleInner>
    </div>
  )
}

export const ReticleLoading = () => {
  return (
    <div
      id="reticle-loading"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 30,
        left: 0,
        right: 0,
        zIndex: 2,
        // display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      }}
      className="hidden"
    >
      <ReticleInner>
        <CircularProgress />
      </ReticleInner>
    </div>
  )
}
