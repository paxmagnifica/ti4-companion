import { GameVersion } from '../GameVersionPicker'

export const FACTION = {
  The_Arborec: 'The_Arborec',
  The_Barony_of_Letnev: 'The_Barony_of_Letnev',
  The_Clan_of_Saar: 'The_Clan_of_Saar',
  The_Embers_of_Muaat: 'The_Embers_of_Muaat',
  The_Emirates_of_Hacan: 'The_Emirates_of_Hacan',
  The_Federation_of_Sol: 'The_Federation_of_Sol',
  The_Ghosts_of_Creuss: 'The_Ghosts_of_Creuss',
  The_L1Z1X_Mindnet: 'The_L1Z1X_Mindnet',
  The_Mentak_Coalition: 'The_Mentak_Coalition',
  The_Naalu_Collective: 'The_Naalu_Collective',
  The_Nekro_Virus: 'The_Nekro_Virus',
  Sardakk_Norr: 'Sardakk_Norr',
  The_Universities_of_Jol__Nar: 'The_Universities_of_Jol__Nar',
  The_Winnu: 'The_Winnu',
  The_Xxcha_Kingdom: 'The_Xxcha_Kingdom',
  The_Yin_Brotherhood: 'The_Yin_Brotherhood',
  The_Yssaril_Tribes: 'The_Yssaril_Tribes',
  The_Argent_Flight: 'The_Argent_Flight',
  The_Empyrean: 'The_Empyrean',
  The_Mahact_Gene__Sorcerers: 'The_Mahact_Gene__Sorcerers',
  The_Naaz__Rokha_Alliance: 'The_Naaz__Rokha_Alliance',
  The_Nomad: 'The_Nomad',
  The_Titans_of_Ul: 'The_Titans_of_Ul',
  The_VuilRaith_Cabal: 'The_VuilRaith_Cabal',
  The_Council_Keleres: 'The_Council_Keleres',
  // discordant stars
  The_Shipwrights_of_Axis: 'The_Shipwrights_of_Axis',
  The_Celdauri_Trade_Confederation: 'The_Celdauri_Trade_Confederation',
  The_Savages_of_Cymiae: 'The_Savages_of_Cymiae',
  The_Dih_Mohn_Flotilla: 'The_Dih_Mohn_Flotilla',
  The_Florzen_Profiteers: 'The_Florzen_Profiteers',
  The_Free_Systems_Compact: 'The_Free_Systems_Compact',
  The_Ghemina_Raiders: 'The_Ghemina_Raiders',
  The_Augurs_of_Ilyxum: 'The_Augurs_of_Ilyxum',
  The_L_tokk_Khrask: 'The_L_tokk_Khrask',
  The_Kollecc_Society: 'The_Kollecc_Society',
  The_Kortali_Tribunal: 'The_Kortali_Tribunal',
  The_Li_Zho_Dynasty: 'The_Li_Zho_Dynasty',
  The_Mirveda_Protectorate: 'The_Mirveda_Protectorate',
  The_Glimmer_of_Mortheus: 'The_Glimmer_of_Mortheus',
  The_Myko_Mentori: 'The_Myko_Mentori',
  The_Nivyn_Star_Kings: 'The_Nivyn_Star_Kings',
  The_Olradin_League: 'The_Olradin_League',
  The_Zealots_of_Rhodun: 'The_Zealots_of_Rhodun',
  Roh_Dhna_Mechatronics: 'Roh_Dhna_Mechatronics',
  The_Tnelis_Syndicate: 'The_Tnelis_Syndicate',
  The_Vaden_Banking_Clans: 'The_Vaden_Banking_Clans',
  The_Vaylerian_Scourge: 'The_Vaylerian_Scourge',
  The_Veldyr_Sovereignty: 'The_Veldyr_Sovereignty',
  The_Zelian_Purifier: 'The_Zelian_Purifier',
  The_Bentor_Conglomerate: 'The_Bentor_Conglomerate',
  The_Cheiran_Hordes: 'The_Cheiran_Hordes',
  The_Edyn_Mandate: 'The_Edyn_Mandate',
  The_Ghoti_Wayfarers: 'The_Ghoti_Wayfarers',
  The_Gledge_Union: 'The_Gledge_Union',
  The_Berserkers_of_Kjalengard: 'The_Berserkers_of_Kjalengard',
  The_Monks_of_Kolume: 'The_Monks_of_Kolume',
  The_Kyro_Sodality: 'The_Kyro_Sodality',
  The_Lanefir_Remnants: 'The_Lanefir_Remnants',
  The_Nokar_Sellships: 'The_Nokar_Sellships',
  // Thunder's Edge
  Last_Bastion: 'Last_Bastion',
  The_Ral_Nel_Consortium: 'The_Ral_Nel_Consortium',
  The_Deepwrought_Scholarate: 'The_Deepwrought_Scholarate',
  The_Crimson_Rebellion: 'The_Crimson_Rebellion',
  The_Firmament_The_Obsidian: 'The_Firmament_The_Obsidian'
}

export const factionsData = {
  The_Arborec: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Arborec',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/e/eb/Arborec.png',
    key: 'The_Arborec',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Barony_of_Letnev: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Barony_of_Letnev',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/2/20/Barony.png',
    key: 'The_Barony_of_Letnev',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Clan_of_Saar: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Clan_of_Saar',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/b/b0/Saar.png',
    key: 'The_Clan_of_Saar',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Embers_of_Muaat: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Embers_of_Muaat',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/6/60/Muaat.png',
    key: 'The_Embers_of_Muaat',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Emirates_of_Hacan: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Emirates_of_Hacan',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/f/f8/Hacan.png',
    key: 'The_Emirates_of_Hacan',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Federation_of_Sol: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Federation_of_Sol',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/0/01/Sol.png',
    key: 'The_Federation_of_Sol',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Ghosts_of_Creuss: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Ghosts_of_Creuss',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/7/7f/Ghosts.png',
    key: 'The_Ghosts_of_Creuss',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_L1Z1X_Mindnet: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_L1Z1X_Mindnet',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/e/ec/L1Z1X.png',
    key: 'The_L1Z1X_Mindnet',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Mentak_Coalition: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Mentak_Coalition',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/3/3c/Mentak.png',
    key: 'The_Mentak_Coalition',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Naalu_Collective: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Naalu_Collective',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/a/a7/Naalu.png',
    key: 'The_Naalu_Collective',
    versionOverrides: [GameVersion.PoK_Codex3, GameVersion.ThundersEdge],
  },
  The_Nekro_Virus: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Nekro_Virus',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/2/22/Nekro.png',
    key: 'The_Nekro_Virus',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  Sardakk_Norr: {
    link: 'https://twilight-imperium.fandom.com/wiki/Sardakk_N%27orr',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/1/1d/Sardakk.png',
    key: 'Sardakk_Norr',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Universities_of_Jol__Nar: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Universities_of_Jol-Nar',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/0/06/Jol-Nar.png',
    key: 'The_Universities_of_Jol__Nar',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Winnu: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Winnu',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/cd/Winnu.png',
    key: 'The_Winnu',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Xxcha_Kingdom: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Xxcha_Kingdom',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/1/1a/Xxcha.png',
    key: 'The_Xxcha_Kingdom',
    versionOverrides: [GameVersion.PoK_Codex3, GameVersion.ThundersEdge],
  },
  The_Yin_Brotherhood: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Yin_Brotherhood',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/f/f6/Yin.png',
    key: 'The_Yin_Brotherhood',
    versionOverrides: [GameVersion.PoK_Codex3, GameVersion.ThundersEdge],
  },
  The_Yssaril_Tribes: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Yssaril_Tribes',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/a/ac/Yssaril.png',
    key: 'The_Yssaril_Tribes',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Argent_Flight: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Argent_Flight',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/1/13/ArgentFactionSymbol.png',
    key: 'The_Argent_Flight',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Empyrean: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Empyrean',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/ca/EmpyreanFactionSymbol.png',
    key: 'The_Empyrean',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Mahact_Gene__Sorcerers: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Mahact_Gene-Sorcerers',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/3/35/MahactFactionSymbol.png',
    key: 'The_Mahact_Gene__Sorcerers',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Naaz__Rokha_Alliance: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Naaz-Rokha_Alliance',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c3/NaazRokhaFactionSymbol.png',
    key: 'The_Naaz__Rokha_Alliance',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Nomad: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Nomad',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/5e/NomadFactionSheet.png',
    key: 'The_Nomad',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Titans_of_Ul: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Titans_of_Ul',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/6/6d/UlFactionSymbol.png',
    key: 'The_Titans_of_Ul',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_VuilRaith_Cabal: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Vuil%27Raith_Cabal',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/0/04/CabalFactionSymbol.png',
    key: 'The_VuilRaith_Cabal',
    versionOverrides: [GameVersion.ThundersEdge],
  },
  The_Council_Keleres: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Council_Keleres',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/8/86/KeleresFactionSymbol.png',
    key: 'The_Council_Keleres',
    versionOverrides: [GameVersion.ThundersEdge],
  },

  // discordant stars
  The_Shipwrights_of_Axis: {
    link: 'https://twilight-imperium.fandom.com/wiki/Shipwrights_of_Axis_(UNOFFICIAL)',
    key: 'The_Shipwrights_of_Axis',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/f/fc/Axis_icon.png',
  },
  The_Celdauri_Trade_Confederation: {
    link: 'https://twilight-imperium.fandom.com/wiki/Celdauri_Trade_Confederation_(UNOFFICIAL)',
    key: 'The_Celdauri_Trade_Confederation',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c1/Celdauri_icon.png',
  },
  The_Savages_of_Cymiae: {
    link: 'https://twilight-imperium.fandom.com/wiki/Savages_of_Cymiae_(UNOFFICIAL)',
    key: 'The_Savages_of_Cymiae',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/2/29/Cymiae_icon.png',
  },
  The_Dih_Mohn_Flotilla: {
    link: 'https://twilight-imperium.fandom.com/wiki/Dih-Mohn_Flotilla_(UNOFFICIAL)',
    key: 'The_Dih_Mohn_Flotilla',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/d/d2/Dih-mohn_icon.png',
  },
  The_Florzen_Profiteers: {
    link: 'https://twilight-imperium.fandom.com/wiki/Florzen_Profiteers_(UNOFFICIAL)',
    key: 'The_Florzen_Profiteers',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/55/Florzen_icon.png',
  },
  The_Free_Systems_Compact: {
    link: 'https://twilight-imperium.fandom.com/wiki/Free_Systems_Compact_(UNOFFICIAL)',
    key: 'The_Free_Systems_Compact',
    image: '',
  },
  The_Ghemina_Raiders: {
    link: 'https://twilight-imperium.fandom.com/wiki/Ghemina_Raiders_(UNOFFICIAL)',
    key: 'The_Ghemina_Raiders',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/4/44/Ghemina_icon.png',
  },
  The_Augurs_of_Ilyxum: {
    link: 'https://twilight-imperium.fandom.com/wiki/Augurs_of_Ilyxum_(UNOFFICIAL)',
    key: 'The_Augurs_of_Ilyxum',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/1/1c/Ilyxum_icon.png',
  },
  The_L_tokk_Khrask: {
    link: 'https://twilight-imperium.fandom.com/wiki/L%27tokk_Khrask_(UNOFFICIAL)',
    key: 'The_L_tokk_Khrask',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/7/74/Khrask_icon.png',
  },
  The_Kollecc_Society: {
    link: 'https://twilight-imperium.fandom.com/wiki/Kollecc_Society_(UNOFFICIAL)',
    key: 'The_Kollecc_Society',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/54/Kollecc_icon.png',
  },
  The_Kortali_Tribunal: {
    link: 'https://twilight-imperium.fandom.com/wiki/Kortali_Tribunal_(UNOFFICIAL)',
    key: 'The_Kortali_Tribunal',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/6/6c/Kortali_icon.png',
  },
  The_Li_Zho_Dynasty: {
    link: 'https://twilight-imperium.fandom.com/wiki/Li-Zho_Dynasty_(UNOFFICIAL)',
    key: 'The_Li_Zho_Dynasty',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/2/21/Li-Zho_icon.png',
  },
  The_Mirveda_Protectorate: {
    link: 'https://twilight-imperium.fandom.com/wiki/Mirveda_Protectorate_(UNOFFICIAL)',
    key: 'The_Mirveda_Protectorate',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/e/e3/Mirveda_icon.png',
  },
  The_Glimmer_of_Mortheus: {
    link: 'https://twilight-imperium.fandom.com/wiki/Glimmer_of_Mortheus_(UNOFFICIAL)',
    key: 'The_Glimmer_of_Mortheus',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/f/fc/Mortheus_icon.png',
  },
  The_Myko_Mentori: {
    link: 'https://twilight-imperium.fandom.com/wiki/Myko-Mentori_(UNOFFICIAL)',
    key: 'The_Myko_Mentori',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/6/67/Myko-Mentori_icon.png',
  },
  The_Nivyn_Star_Kings: {
    link: 'https://twilight-imperium.fandom.com/wiki/Nivyn_Star_Kings_(UNOFFICIAL)',
    key: 'The_Nivyn_Star_Kings',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/9/91/Nivyn_icon.png',
  },
  The_Olradin_League: {
    link: 'https://twilight-imperium.fandom.com/wiki/Olradin_League_(UNOFFICIAL)',
    key: 'The_Olradin_League',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/a/af/Olradin_icon.png',
  },
  The_Zealots_of_Rhodun: {
    link: 'https://twilight-imperium.fandom.com/wiki/Zealots_of_Rhodun_(UNOFFICIAL)',
    key: 'The_Zealots_of_Rhodun',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/b/b1/Rhodun_icon.png',
  },
  Roh_Dhna_Mechatronics: {
    link: 'https://twilight-imperium.fandom.com/wiki/Roh%27Dhna_Mechatronics_(UNOFFICIAL)',
    key: 'Roh_Dhna_Mechatronics',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/8/85/Roh%27Dhna_icon.png',
  },
  The_Tnelis_Syndicate: {
    link: 'https://twilight-imperium.fandom.com/wiki/Tnelis_Syndicate_(UNOFFICIAL)',
    key: 'The_Tnelis_Syndicate',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c4/Tnelis_icon.png',
  },
  The_Vaden_Banking_Clans: {
    link: 'https://twilight-imperium.fandom.com/wiki/Vaden_Banking_Clans_(UNOFFICIAL)',
    key: 'The_Vaden_Banking_Clans',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/55/Vaden_icon.png',
  },
  The_Vaylerian_Scourge: {
    link: 'https://twilight-imperium.fandom.com/wiki/Vaylerian_Scourge_(UNOFFICIAL)',
    key: 'The_Vaylerian_Scourge',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/1/1a/Vaylerian_icon.png',
  },
  The_Veldyr_Sovereignty: {
    link: 'https://twilight-imperium.fandom.com/wiki/Veldyr_Sovereignty_(UNOFFICIAL)',
    key: 'The_Veldyr_Sovereignty',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/2/25/Veldyr_icon.png',
  },
  The_Zelian_Purifier: {
    link: 'https://twilight-imperium.fandom.com/wiki/Zelian_Purifier_(UNOFFICIAL)',
    key: 'The_Zelian_Purifier',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/51/Zelian_icon.png',
  },
  The_Bentor_Conglomerate: {
    link: 'https://twilight-imperium.fandom.com/wiki/Bentor_Conglomerate_(UNOFFICIAL)',
    key: 'The_Bentor_Conglomerate',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c9/Bentor_icon.png',
  },
  The_Cheiran_Hordes: {
    link: 'https://twilight-imperium.fandom.com/wiki/Cheiran_Hordes_(UNOFFICIAL)',
    key: 'The_Cheiran_Hordes',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c6/Cheiran_icon.png',
  },
  The_Edyn_Mandate: {
    link: 'https://twilight-imperium.fandom.com/wiki/Edyn_Mandate_(UNOFFICIAL)',
    key: 'The_Edyn_Mandate',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/b/be/Edyn_icon.png',
  },
  The_Ghoti_Wayfarers: {
    link: 'https://twilight-imperium.fandom.com/wiki/Ghoti_Wayfarers_(UNOFFICIAL)',
    key: 'The_Ghoti_Wayfarers',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/3/35/Ghoti_icon.png',
  },
  The_Gledge_Union: {
    link: 'https://twilight-imperium.fandom.com/wiki/Gledge_Union_(UNOFFICIAL)',
    key: 'The_Gledge_Union',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/7/72/Gledge_icon.png',
  },
  The_Berserkers_of_Kjalengard: {
    link: 'https://twilight-imperium.fandom.com/wiki/Berserkers_of_Kjalengard_(UNOFFICIAL)',
    key: 'The_Berserkers_of_Kjalengard',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/a/a9/Kjalengard_icon.png',
  },
  The_Monks_of_Kolume: {
    link: 'https://twilight-imperium.fandom.com/wiki/Monks_of_Kolume_(UNOFFICIAL)',
    key: 'The_Monks_of_Kolume',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/3/30/Kolume_icon.png',
  },
  The_Kyro_Sodality: {
    link: 'https://twilight-imperium.fandom.com/wiki/Kyro_Sodality_(UNOFFICIAL)',
    key: 'The_Kyro_Sodality',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/f/fe/Kyro_icon.png',
  },
  The_Lanefir_Remnants: {
    link: 'https://twilight-imperium.fandom.com/wiki/Lanefir_Remnants_(UNOFFICIAL)',
    key: 'The_Lanefir_Remnants',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/c8/Lanefir_icon.png',
  },
  The_Nokar_Sellships: {
    link: 'https://twilight-imperium.fandom.com/wiki/Nokar_Sellships_(UNOFFICIAL)',
    key: 'The_Nokar_Sellships',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/c/cf/Nokar_icon.png',
  },
  // Thunder's edge
  Last_Bastion: {
    link: 'https://twilight-imperium.fandom.com/wiki/Last_Bastion',
    key: 'Last_Bastion',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/6/62/LastBastionFactionSymbol.png',
  },
  The_Ral_Nel_Consortium: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Ral_Nel_Consortium',
    key: 'The_Ral_Nel_Consortium',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/5/5c/RalNelFactionSymbol.png',
  },
  The_Deepwrought_Scholarate: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Deepwrought_Scholarate',
    key: 'The_Deepwrought_Scholarate',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/8/83/DWSFactionSymbol.png',
  },
  The_Crimson_Rebellion: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Crimson_Rebellion',
    key: 'The_Crimson_Rebellion',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/0/00/CrimsonFactionSymbol.png',
  },
  The_Firmament_The_Obsidian: {
    link: 'https://twilight-imperium.fandom.com/wiki/The_Firmament_/_The_Obsidian',
    key: 'The_Firmament_The_Obsidian',
    image:
      'https://static.wikia.nocookie.net/twilight-imperium-4/images/e/eb/FirmamentFactionSymbol.png',
  },
}
