const FIFTEEN_MINUTES = 1000 * 60 * 15

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  wakeLockPingInterval:
    process.env.REACT_APP_WAKELOCK_PING_INTERVAL || FIFTEEN_MINUTES,
}

export default config
