import { colorNames } from './plasticColors'

export function ColorBox({ color, onClick, size = '1em', style, ...rest }) {
  if (color === null) {
    return null
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundColor: color,
        borderRadius: '2px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        ...style,
      }}
      title={colorNames[color]}
      {...rest}
    />
  )
}
