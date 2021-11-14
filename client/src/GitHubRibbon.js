import React from 'react'
import { ReactComponent as GitHubRibbonIcon } from './assets/github-ribbon.svg'

function GitHubRibbon() {
  return (
    <a
      aria-label="View source on GitHub"
      className="github-corner"
      href="https://github.com/tarnas14/ti4-companion"
    >
      <GitHubRibbonIcon />
    </a>
  )
}

export default GitHubRibbon
