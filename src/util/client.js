import axios from 'axios'

const { REACT_APP_BACKEND_URL } = process.env

export const request = async config => {
  let message

  if (config.url.indexOf('http://') < 0 && config.url.indexOf('https://') < 0) {
    config.url = REACT_APP_BACKEND_URL.concat(config.url)
  } else {
    config.headers = {}
  }

  if (config.url.search('amazonaws') !== -1) {
    message = 'Unable to connect to server. Please try again.'
  }

  try {
    const response = await axios.request({
      timeout: 10000,
      ...config,
    })

    return response.data
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.message)
      return
    } else if (message) {
      throw new Error(message)
    } else if (((err.response || {}).data || {}).message) {
      console.log(err.response.data.message)
      throw new Error(err.response.data.message)
    } else if (err.request) {
      console.log(err.request)
      throw new Error(
        'Unable to connect to server. Please check your internet connection.'
      )
    } else {
      console.log(err.message)
      return
    }
  }
}
