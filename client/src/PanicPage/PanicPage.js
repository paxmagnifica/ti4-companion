import React from 'react'
import { Trans } from 'react-i18next'

import destroyed from '../assets/destroyed.webp'

export class PanicPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            alt="destroyed planet"
            src={destroyed}
            style={{ borderRadius: '50%', height: '15vh', marginBottom: '2em' }}
          />
          <p style={{ fontSize: '1.5em' }}>
            <Trans i18nKey="panicPage.message" />
          </p>
          <a href="https://willcodeforskipass.com" rel="nofollow">
            <img
              alt="the guy to notify about errors"
              src="https://willcodeforskipass.com/images/kon.png"
              style={{ height: '25vh' }}
            />
          </a>
          <p style={{ textAlign: 'center' }}>
            facebook:{' '}
            <a
              href="https://www.facebook.com/tarnas14"
              rel="nofollow"
              style={{ color: 'white' }}
            >
              tarnas14
            </a>
            <br />
            e-mail:{' '}
            <a
              href="mailto:tarnas14@gmail.com"
              rel="nofollow"
              style={{ color: 'white' }}
            >
              tarnas14@gmail.com
            </a>
            <br />
          </p>
          <p style={{ textAlign: 'center' }}>
            <Trans i18nKey="panicPage.or" />{' '}
            <a
              href="https://github.com/paxmagnifica/ti4-companion/issues/new"
              rel="nofollow"
              style={{ color: 'white' }}
            >
              <Trans i18nKey="panicPage.submitAnIssue" />
            </a>
          </p>
        </div>
      )
    }

    return children
  }
}
