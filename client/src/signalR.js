import React, { useEffect, useState } from 'react'

import CONFIG from './config'

export const SignalRConnectionContext = React.createContext()

export function SignalRConnectionProvider({ children }) {
  const [signalRConnection, setSignalRConnection] = useState(null)

  useEffect(() => {
    if (!window.signalR) {
      console.log('signalR not available :(')

      return () => null
    }

    const connection = new window.signalR.HubConnectionBuilder()
      .withUrl(`${CONFIG.apiUrl}/sessionHub`)
      .configureLogging(window.signalR.LogLevel.Information)
      .build()

    async function start() {
      try {
        await connection.start()
        setSignalRConnection(connection)
        console.log('SignalR Connected.')
      } catch (err) {
        console.log(err)
        setTimeout(start, 5000)
      }
    }

    connection.onclose(async () => {
      await start()
    })

    start()

    return () => connection.current.stop()
  }, [])

  if (!signalRConnection) {
    return null
  }

  return (
    <SignalRConnectionContext.Provider value={signalRConnection}>
      {children}
    </SignalRConnectionContext.Provider>
  )
}
