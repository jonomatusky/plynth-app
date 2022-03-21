import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useRequest } from 'hooks/use-request'
import TemplateSwitch from './components/TemplateSwitch'

const Experience = () => {
  const { request } = useRequest()
  const { id } = useParams()
  const [status, setStatus] = useState('idle')
  const [experience, setExperience] = useState()

  // const experience = {
  //   objects: [
  //     {
  //       assetUrl: 'https://plynthplayer.com/RPReplay_Final1636473423-480.mov',
  //       height: 0.6666,
  //     },
  //   ],
  // }

  useEffect(() => {
    if (status === 'idle' && !experience) {
      setStatus('loading')
    }
  }, [experience, status])

  useEffect(() => {
    const getExperience = async () => {
      console.log('getExperience')
      try {
        const res = await request({ url: `/experiences/${id}` })
        setExperience(res.experience)
        setStatus('succeeded')
      } catch (err) {
        console.log(err)
        setStatus('failed')
      }
    }
    if (status === 'loading' && id) {
      getExperience()
    }
  }, [status, request, id])

  return <TemplateSwitch experience={experience} />
}

export default Experience
