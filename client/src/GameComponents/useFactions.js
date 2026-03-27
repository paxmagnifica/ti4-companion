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
const discordantStars = [
  FACTION.The_Shipwrights_of_Axis,
  FACTION.The_Celdauri_Trade_Confederation,
  FACTION.The_Savages_of_Cymiae,
  FACTION.The_Dih_Mohn_Flotilla,
  FACTION.The_Florzen_Profiteers,
  FACTION.The_Free_Systems_Compact,
  FACTION.The_Ghemina_Raiders,
  FACTION.The_Augurs_of_Ilyxum,
  FACTION.The_L_tokk_Khrask,
  FACTION.The_Kollecc_Society,
  FACTION.The_Kortali_Tribunal,
  FACTION.The_Li_Zho_Dynasty,
  FACTION.The_Mirveda_Protectorate,
  FACTION.The_Glimmer_of_Mortheus,
  FACTION.The_Myko_Mentori,
  FACTION.The_Nivyn_Star_Kings,
  FACTION.The_Olradin_League,
  FACTION.The_Zealots_of_Rhodun,
  FACTION.Roh_Dhna_Mechatronics,
  FACTION.The_Tnelis_Syndicate,
  FACTION.The_Vaden_Banking_Clans,
  FACTION.The_Vaylerian_Scourge,
  FACTION.The_Veldyr_Sovereignty,
  FACTION.The_Zelian_Purifier,
  FACTION.The_Bentor_Conglomerate,
  FACTION.The_Cheiran_Hordes,
  FACTION.The_Edyn_Mandate,
  FACTION.The_Ghoti_Wayfarers,
  FACTION.The_Gledge_Union,
  FACTION.The_Berserkers_of_Kjalengard,
  FACTION.The_Monks_of_Kolume,
  FACTION.The_Kyro_Sodality,
  FACTION.The_Lanefir_Remnants,
  FACTION.The_Nokar_Sellships,
]
const codex3 = [FACTION.The_Council_Keleres]
const thundersEdge = [
  FACTION.Last_Bastion,
  FACTION.The_Deepwrought_Scolarate,
  FACTION.The_Crimson_Rebellion,
  FACTION.The_Ral_Nel_Consortium,
  FACTION.The_Firmament_The_Obsidian,
]
const base = Object.entries(FACTION)
  .filter(
    ([key]) =>
      !pok.includes(key) &&
      !codex3.includes(key) &&
      !discordantStars.includes(key),
  )
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
      case GameVersion.DiscordantStars:
        return { factions: [...base, ...pok, ...codex3, ...discordantStars] }
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
      return factions.find((a) => a.key === factionKey) || {}
    }

    return { getData: (key) => factions.find((a) => a.key === key) || {} }
  }, [factionKey, factions])
}
