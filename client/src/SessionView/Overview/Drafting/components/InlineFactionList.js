import { FactionImage } from '../../../../shared/FactionImage'

export function InlineFactionList({ factions }) {
  return factions.map((factionKey) => (
    <FactionImage
      factionKey={factionKey}
      style={{ width: 'auto', height: '30px' }}
    />
  ))
}
