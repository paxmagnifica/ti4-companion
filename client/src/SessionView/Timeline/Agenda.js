import { Card } from '../../shared/Card'
import useSmallViewport from '../../shared/useSmallViewport'
import agendaSprite from '../../assets/agenda-sprite.jpg'

export function Agenda({ slug }) {
  const small = useSmallViewport()

  return (
    <Card
      background={agendaSprite}
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
