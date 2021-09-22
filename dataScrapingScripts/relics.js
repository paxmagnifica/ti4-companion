// scraping source:
// https://twilight-imperium.fandom.com/wiki/Exploration#Relic_Fragments_and_Relics
// use in developer tools on the page above
function scrapeDataInBrowser() {
  const getCards = (articleTable, version) => {
    const [_ignored, ...rows] = articleTable.querySelectorAll('tr')
    return rows.map(row => {
      const [title, effect] = row.querySelectorAll('td')
      return {
        title: title.innerText.trim(),
        effect: effect.innerText.trim(),
        version,
      }
    })
  }

  const [,,,,pokRelics, codexIIRelics] = document.querySelectorAll('.article-table')
  return [
    ...getCards(pokRelics, 'GameVersion.PoK'),
    ...getCards(codexIIRelics, 'GameVersion.PoK_Codex2'),
  ]
}

// paste here the result of the above script in browser
const scrapedData = [
  {
    "title": "Dominus Orb",
    "effect": "Before you move units during a tactical action, you may purge this card to move and transport units that are in systems that contain 1 of your command tokens.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "Maw of Worlds",
    "effect": "At the start of the agenda phase, you may purge this card and exhaust all of your planets to gain any 1 technology.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "Scepter of Emelpar",
    "effect": "When you would spend a token from your strategy pool, you may exhaust this card to spend a token from your reinforcements instead.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "Shard of the Throne",
    "effect": "When you gain this card, gain 1 victory point. When you lose this card, lose 1 victory point.\n\nWhen a player gains control of a legendary planet you control, or a planet you control in your home system, that player gains this card.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "Stellar Converter",
    "effect": "ACTION: Choose 1 non-home, non-legendary planet other than Mecatol Rex in a system that is adjacent to 1 or more of your units that have BOMBARDMENT; destroy all units on that planet and purge its attachments and its planet card. Then, place the destroyed planet token on that planet and purge this card.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "The Codex",
    "effect": "ACTION: Purge this card to take up to 3 action cards of your choice from the action card discard pile.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "The Crown of Emphidia",
    "effect": "After you perform a tactical action, you may exhaust this card to explore 1 planet you control\n\nAt the end of the status phase, if you control the \"Tomb of Emphidia\" , you may purge this card to gain 1 Victory Point.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "The Crown of Thalnos",
    "effect": "During each combat round, this card's owner may reroll any number of their dice, applying +1 to the results; any units that reroll dice but do not produce at least 1 hit are destroyed.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "The Obsidian",
    "effect": "When you gain this card, draw 1 secret objective. You can have 1 additional scored or unscored secret objective.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "The Prophet's Tears",
    "effect": "When you research a technology, you may exhaust this card to ignore 1 prerequisite or draw 1 action card.",
    "version": "GameVersion.PoK"
  },
  {
    "title": "Dynamis Core",
    "effect": "While this card is in your play area, your commodity value is increased by 2.\n\nACTION: Purge this card to gain trade goods equal to your printed commodity value +2.",
    "version": "GameVersion.PoK_Codex2"
  },
  {
    "title": "JR-XS455-O",
    "effect": "ACTION: Exhaust this agent and choose a player; that player may spend 3 resources to place a structure on a planet they control. If they do not, they gain 1 trade good.",
    "version": "GameVersion.PoK_Codex2"
  },
  {
    "title": "Nano-Forge",
    "effect": "ACTION: Attach this card to a non-legendary, non-home planet you control; its resource and influence values are increased by 2 and it is a legendary planet.",
    "version": "GameVersion.PoK_Codex2"
  }
]

const TECHNOLOGY = {
  green: 'Technology.Biotic',
  blue: 'Technology.Propulsion',
  yellow: 'Technology.Cybernetic',
  red: 'Technology.Warfare',
}

const slugify = t => t.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')

const generateDbInitialization = () => {
  scrapedData.forEach(datum => console.log(`new Relic("${slugify(datum.title)}", ${datum.version}),`))
}

const generateTranslations = () => {
  scrapedData.forEach(datum => console.log(`"${slugify(datum.title)}": { "slug": "${slugify(datum.title)}", "title": "${datum.title}", "effect": "${datum.effect}"},`))
}

generateDbInitialization()
generateTranslations()
