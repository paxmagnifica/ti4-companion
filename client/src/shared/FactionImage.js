import { useTranslation } from '../i18n'
import { useFactionData } from '../GameComponents'

export function FactionImage({ factionKey, ...props }) {
  const factionData = useFactionData(factionKey)
  const { t } = useTranslation()

  return (
    <img
      alt={factionKey}
      src={factionData.image}
      title={t(`factions.${factionKey}.name`)}
      {...props}
    />
  )
}
