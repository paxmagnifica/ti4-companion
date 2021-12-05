const FIFTEEN_MINUTES = 1000 * 60 * 15

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  chatwootToken: process.env.REACT_APP_CHATWOOT_TOKEN,
  wakeLockPingInterval:
    process.env.REACT_APP_WAKELOCK_PING_INTERVAL || FIFTEEN_MINUTES,
  isDevelopment: process.env.NODE_ENV === 'development',
}

export default config
