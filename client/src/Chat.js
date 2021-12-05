import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import config from './config'

const BASE_URL = 'https://app.chatwoot.com'

export function Chat() {
  const [isChatwootReady, setIsChatwootReady] = useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    const setIsReady = () => setIsChatwootReady(true)
    window.addEventListener('chatwoot:ready', setIsReady)

    return () => window.removeEventListener('chatwoot:ready', setIsReady)
  }, [])

  useEffect(() => {
    if (isChatwootReady) {
      return
    }

    window.chatwootSettings = {
      position: 'left',
      language: i18n.language,
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.id = 'hs-script-loader'
    script.src = `${BASE_URL}/packs/js/sdk.js`
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: config.chatwootToken,
        baseUrl: BASE_URL,
      })
    }

    document.body.appendChild(script)

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.removeChild(script)
    }
  }, [isChatwootReady, i18n.language])

  useEffect(() => {
    if (!isChatwootReady) {
      return
    }
    window.$chatwoot.setLocale(i18n.language)
  }, [isChatwootReady, i18n.language])

  return <></>
}
