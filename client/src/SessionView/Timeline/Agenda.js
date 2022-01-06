import { Card } from '../../shared/Card'
import useSmallViewport from '../../shared/useSmallViewport'
import agendaSprite from '../../assets/agenda-sprite.jpg'

export function Agenda({ slug, type }) {
  const small = useSmallViewport()

  const agendaType = type === undefined || type === null ? 1 : type
  const offset = agendaType === 0 ? '50%' : null

  return (
    <Card
      background={agendaSprite}
      backgroundOffsetX={offset}
      effectColor="black"
      effectMaskColor="white"
      fillBottom="1%"
      slug={slug}
      small={small}
      titleMaskColor="#1a1819"
      translationNamespace="agendas"
    />
  )
}
