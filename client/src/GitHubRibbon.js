import React from 'react'
import { ReactComponent as GitHubRibbonIcon } from './assets/github-ribbon.svg'

function GitHubRibbon() {
  return (
    <a
      href="https://github.com/tarnas14/ti4-companion"
      className="github-corner"
      aria-label="View source on GitHub"
    >
      <GitHubRibbonIcon />
    </a>
  )
}

export default GitHubRibbon
