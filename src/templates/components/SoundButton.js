import React from 'react'
import { Box } from '@mui/system'
import { IconButton } from '@mui/material'
import { VolumeOff, VolumeUp } from '@mui/icons-material'

const SoundButton = ({ toggleMute, isMuted }) => {
  return (
    <Box position="absolute" zIndex="1000" bottom="50px" right="30px">
      <IconButton onClick={toggleMute} size="large">
        {isMuted ? (
          <VolumeOff sx={{ color: 'white', fontSize: 50 }} />
        ) : (
          <VolumeUp sx={{ color: 'white', fontSize: 50 }} />
        )}
      </IconButton>
    </Box>
  )
}

export default SoundButton
