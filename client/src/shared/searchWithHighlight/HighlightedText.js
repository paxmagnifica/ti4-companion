import Highlighter from 'react-highlight-words'

export function HighlightedText({ children, highlight }) {
  if (!highlight) {
    return children
  }

  return (
    <Highlighter
      autoEscape
      searchWords={highlight.split(' ')}
      textToHighlight={children}
    />
  )
}
