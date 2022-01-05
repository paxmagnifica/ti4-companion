import React, { useEffect, useState, useContext } from 'react'
import * as signalR from '@microsoft/signalr'

import CONFIG from './config'

const SignalRConnectionContext = React.createContext()

export const useSignalRConnection = () => {
  const signalRConnection = useContext(SignalRConnectionContext)

  return signalRConnection
}

export function SignalRConnectionProvider({ children }) {
  const [signalRConnection, setSignalRConnection] = useState(null)

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${CONFIG.apiUrl}/sessionHub`)
      .configureLogging(signalR.LogLevel.Information)
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

  return (
    <SignalRConnectionContext.Provider value={signalRConnection}>
      {children}
    </SignalRConnectionContext.Provider>
  )
}
