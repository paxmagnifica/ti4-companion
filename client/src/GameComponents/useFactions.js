import { useMemo } from 'react'

import { useGameVersion } from './useGameVersion'
import { GameVersion } from './GameVersionPicker'
import { FACTION, factionsData } from './gameInfo/factions'

const pok = [
  FACTION.The_Argent_Flight,
  FACTION.The_Empyrean,
  FACTION.The_Mahact_Gene__Sorcerers,
  FACTION.The_Naaz__Rokha_Alliance,
  FACTION.The_Nomad,
  FACTION.The_Titans_of_Ul,
  FACTION.The_VuilRaith_Cabal,
]
const codex3 = [FACTION.The_Council_Keleres]
const base = Object.entries(FACTION)
  .filter(([key]) => !pok.includes(key) && !codex3.includes(key))
  .map(([, value]) => value)

export const useFactionsList = (versionOverride) => {
  const { gameVersion } = useGameVersion()

  return useMemo(() => {
    const switchedVersion =
      versionOverride !== undefined ? versionOverride : gameVersion
    switch (switchedVersion) {
      case GameVersion.Base:
        return { factions: base }
      case GameVersion.PoK:
      case GameVersion.PoK_Codex2:
        return { factions: [...base, ...pok] }
      case GameVersion.PoK_Codex3:
      default:
        return { factions: [...base, ...pok, ...codex3] }
    }
  }, [gameVersion, versionOverride])
}

export const useFactionsData = (versionOverride) => {
  const { gameVersion } = useGameVersion()
  const versionToUse =
    versionOverride === undefined ? gameVersion : versionOverride
  const { factions: list } = useFactionsList(versionOverride)

  return useMemo(
    () => ({
      factions: Object.entries(factionsData)
        .filter(([key]) => list.includes(key))
        .map(([, factionData]) => ({
          ...factionData,
          cheatSheetPath:
            factionData.versionOverrides &&
            factionData.versionOverrides.includes(versionToUse)
              ? `/factionCheatsheets/${factionData.key.toLowerCase()}_${versionToUse}.png`
              : `/factionCheatsheets/${factionData.key.toLowerCase()}.png`,
        })),
    }),
    [list, versionToUse],
  )
}

export const useFactionData = (factionKey) => {
  const { factions } = useFactionsData()

  return useMemo(() => {
    if (factionKey) {
      return factions.find((a) => a.key === factionKey)
    }

    return { getData: (key) => factions.find((a) => a.key === key) }
  }, [factionKey, factions])
}
