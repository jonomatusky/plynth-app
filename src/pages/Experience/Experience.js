import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useRequest } from 'hooks/use-request'
import TemplateSwitch from './components/TemplateSwitch'
import LoadingScreen from 'components/LoadingScreen'
import NotFound from 'components/NotFound'

const Experience = () => {
  const { request } = useRequest()
  const { id } = useParams()
  const [status, setStatus] = useState('idle')
  const [experience, setExperience] = useState()

  useEffect(() => {
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload()
      }
    }
  }, [])

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

  if (!!experience && !experience.isRemoved) {
    return <TemplateSwitch experience={experience} />
  } else if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />
  } else {
    return <NotFound />
  }
}

export default Experience
