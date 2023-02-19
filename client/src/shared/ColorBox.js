import { colorNames } from './plasticColors'

export function ColorBox({
  color,
  inline,
  disabled,
  onClick,
  size = '1em',
  style,
  ...rest
}) {
  if (!color) {
    return null
  }

  const componentStyle = {
    width: size,
    height: size,
    display: 'inline-block',
    backgroundColor: color,
    borderRadius: '2px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    cursor: inline || disabled ? 'default' : 'pointer',
    flexShrink: 0,
  }

  if (inline) {
    componentStyle.marginLeft = '0.4em'
    componentStyle.marginBottom = '-0.1em'
  }

  return (
    <div
      onClick={onClick}
      style={{
        ...componentStyle,
        ...style,
      }}
      title={colorNames[color]}
      {...rest}
    />
  )
}
