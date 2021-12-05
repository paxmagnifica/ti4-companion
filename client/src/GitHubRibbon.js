import React from 'react'

import { useFullscreen } from './Fullscreen'
import { ReactComponent as GitHubRibbonIcon } from './assets/github-ribbon.svg'

function GitHubRibbon() {
  const { fullscreen } = useFullscreen()

  if (fullscreen) {
    return null
  }

  return (
    <a
      aria-label="View source on GitHub"
      className="github-corner"
      href="https://github.com/paxmagnifica/ti4-companion"
    >
      <GitHubRibbonIcon />
    </a>
  )
}

export default GitHubRibbon
