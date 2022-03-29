import { Dialog, DialogContent, DialogTitle, Link } from '@mui/material'
import React from 'react'

const ErrorDialog = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Something went wrong</DialogTitle>
      <DialogContent>
        We're unable to access your device's camera. Try switching browsers, or
        follow these steps and then refresh the page:
        <br />
        <br />
        <b>On iPhone: </b>
        Open the Settings app → Scroll down and tap your browser icon → Flip
        switch next to "Camera"
        <br />
        <br />
        <b>On Android: </b>
        Open the Settings app → Scroll down and tap your browser icon → Tap
        Permissions → Flip switch next to "Camera"
        <br />
        <br />
        If that doesn't work,{' '}
        <Link
          href="https://plynth.com/contact"
          target="_blank"
          rel="noreferrer"
        >
          contact us
        </Link>
        .
      </DialogContent>
    </Dialog>
  )
}

export default ErrorDialog
