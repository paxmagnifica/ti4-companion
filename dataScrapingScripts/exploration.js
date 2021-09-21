// scraping source:
// https://twilight-imperium.fandom.com/wiki/Exploration
// use in developer tools on the page above
function scrapeDataInBrowser() {
  const PLANET_TYPE = {
    cultural: 'PlanetType.Cultural',
    industrial: 'PlanetType.Industrial',
    hazardous: 'PlanetType.Hazardous',
    frontier: 'PlanetType.Frontier',
  }
  const getCards = (articleTable, type) => {
    const [_ignored, ...rows] = articleTable.querySelectorAll('tr')
    return rows.map(row => {
      const [title, numberInDeck, effect] = row.querySelectorAll('td')
      return {
        title: title.innerText.trim(),
        numberInDeck: Number(numberInDeck.innerText.trim()),
        effect: effect.innerText.trim(),
        type,
        influence: Number((effect.innerText.trim().match(/influence value is increased by (\d)/) || [])[1] || 0),
        resources: Number((effect.innerText.trim().match(/resource value is increased by (\d)/) || [])[1] || 0),
      }
    })
  }

  const [cultural, industrial, hazardous, frontier] = document.querySelectorAll('.article-table')
  return [
    ...getCards(cultural, PLANET_TYPE.cultural),
    ...getCards(industrial, PLANET_TYPE.industrial),
    ...getCards(hazardous, PLANET_TYPE.hazardous),
    ...getCards(frontier, PLANET_TYPE.frontier),
  ]
}

// paste here the result of the above script in browser
const scrapedData = [
  {
    "title": "Demilitarized Zone",
    "numberInDeck": 1,
    "effect": "Return all structures on this planet to your reinforcements. Then, return all ground forces on this planet to the space area. ATTACH: Units cannot be committed to, produced on or placed on this planet. During the agenda phase, this planet's planet card can be traded as part of a transaction.",
    "type": "PlanetType.Cultural",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Dyson Sphere",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's resource value is increased by 2 and its influence value is increased by 1.",
    "type": "PlanetType.Cultural",
    "attachment": true,
    "influence": 1,
    "resources": 2
  },
  {
    "title": "Freelancers",
    "numberInDeck": 3,
    "effect": "You may produce 1 unit in this system; you may spend influence as if it were resources to produce this unit.",
    "type": "PlanetType.Cultural",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Gamma Wormhole",
    "numberInDeck": 1,
    "effect": "Place a gamma wormhole token in this system. Then, purge this card.",
    "type": "PlanetType.Cultural",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Mercenary Outfit",
    "numberInDeck": 3,
    "effect": "You may place 1 infantry from your reinforcements on this planet.",
    "type": "PlanetType.Cultural",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Paradise World",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's influence value is increased by 2.",
    "type": "PlanetType.Cultural",
    "attachment": true,
    "influence": 2,
    "resources": 0
  },
  {
    "title": "Tomb of Emphidia",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's influence value is increased by 1.\n\n: If the player who has the \"Crown of Emphidia\" Relic has control of this planet, they can use that relic to gain 1 Victory Point.",
    "type": "PlanetType.Cultural",
    "attachment": true,
    "influence": 1,
    "resources": 0
  },
  {
    "title": "Cultural Relic Fragment",
    "numberInDeck": 9,
    "effect": "ACTION: Purge 3 of your cultural relic fragments to gain 1 Relic.",
    "type": "PlanetType.Cultural",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Abandoned Warehouses",
    "numberInDeck": 4,
    "effect": "You may gain 2 commodities, or you may convert up to 2 of your commodities to trade goods.",
    "type": "PlanetType.Industrial",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Biotic Research Facility",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet has a green technology specialty; if this planet already has a technology specialty, this planet's resource and influence values are each increased by 1 instead.",
    "type": "PlanetType.Industrial",
    "attachment": true,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Cybernetic Research Facility",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet has a yellow technology specialty; if this planet already has a technology specialty, this planet's resource and influence values are each increased by 1 instead.",
    "type": "PlanetType.Industrial",
    "attachment": true,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Functioning Base",
    "numberInDeck": 4,
    "effect": "You may gain 1 commodity, or you may spend 1 trade good or 1 commodity to draw 1 action card.",
    "type": "PlanetType.Industrial",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Local Fabricators",
    "numberInDeck": 4,
    "effect": "You may gain 1 commodity, or you may spend 1 trade good or 1 commodity to place 1 mech from your reinforcements on this planet.",
    "type": "PlanetType.Industrial",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Propulsion Research Facility",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet has a blue technology specialty; if this planet already has a technology specialty, this planet's resource and influence values are each increased by 1 instead.",
    "type": "PlanetType.Industrial",
    "attachment": true,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Industrial Relic Fragment",
    "numberInDeck": 5,
    "effect": "ACTION: Purge 3 of your industrial relic fragments to gain 1 Relic.",
    "type": "PlanetType.Industrial",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Core Mine",
    "numberInDeck": 3,
    "effect": "If you have at least 1 mech on this planet, or if you remove 1 infantry from this planet, gain 1 trade good.",
    "type": "PlanetType.Hazardous",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Expedition",
    "numberInDeck": 3,
    "effect": "If you have at least 1 mech on this planet or if you remove 1 infantry from this planet, ready this planet.",
    "type": "PlanetType.Hazardous",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Lazax Survivors",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's resource value is increased by 1 and its influence value is increased by 2.",
    "type": "PlanetType.Hazardous",
    "attachment": true,
    "influence": 2,
    "resources": 1
  },
  {
    "title": "Mining World",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's resource value is increased by 2.",
    "type": "PlanetType.Hazardous",
    "attachment": true,
    "influence": 0,
    "resources": 2
  },
  {
    "title": "Rich World",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet's resource value is increased by 1.",
    "type": "PlanetType.Hazardous",
    "attachment": true,
    "influence": 0,
    "resources": 1
  },
  {
    "title": "Volatile Fuel Source",
    "numberInDeck": 3,
    "effect": "If you have at least 1 mech on this planet, or if you remove 1 infantry from this planet, gain 1 command token.",
    "type": "PlanetType.Hazardous",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Warfare Research Facility",
    "numberInDeck": 1,
    "effect": "ATTACH: This planet has a red technology specialty; if this planet already has a technology specialty, this planet's resource and influence values are each increased by 1 instead.",
    "type": "PlanetType.Hazardous",
    "attachment": true,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Hazardous Relic Fragment",
    "numberInDeck": 7,
    "effect": "ACTION: Purge 3 of your hazardous relic fragments to gain 1 Relic.",
    "type": "PlanetType.Hazardous",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Derelict Vessel",
    "numberInDeck": 2,
    "effect": "Draw 1 secret objective.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Enigmatic Device",
    "numberInDeck": 2,
    "effect": "Place this card face up in your play area.\n\nACTION: You may spend 6 resources and purge this card to research 1 technology.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Gamma Relay",
    "numberInDeck": 1,
    "effect": "Place a gamma wormhole token in this system. Then, purge this card.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Ion Storm",
    "numberInDeck": 1,
    "effect": "Place the ion storm token in this system with either side face up. Then, place this card in the common play area. At the end of a \"Move Ships\" or \"Retreat\" sub-step of a tactical action during which 1 or more of your ships use the ion storm wormhole, flip the ion storm token to its opposing side.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Lost Crew",
    "numberInDeck": 2,
    "effect": "Draw 2 Action Cards.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Merchant Station",
    "numberInDeck": 2,
    "effect": "You may replenish your commodities, or you may convert your commodities to trade goods.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Mirage",
    "numberInDeck": 1,
    "effect": "Place the Mirage planet token in this system. Gain the Mirage planet card and ready it. Then, purge this card.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  },
  {
    "title": "Unknown Relic Fragment",
    "numberInDeck": 3,
    "effect": "This card counts as a relic fragment of any type.",
    "type": "PlanetType.Frontier",
    "attachment": false,
    "influence": 0,
    "resources": 0
  }
]

function generateDbInitialization() {
  scrapedData.forEach(datum => console.log(`new Exploration("${datum.title.toLowerCase().replace(/\s+/g, '-')}", GameVersion.PoK_Codex2, ${datum.type}, ${datum.numberInDeck}, ${datum.influence}, ${datum.resources}),`))
}

function generateTranslations() {
  scrapedData.forEach(datum => console.log(`"${datum.title.toLowerCase().replace(/\s+/g, '-')}": { "title": "${datum.title}", "effect": "${datum.effect}"},`))
}

generateDbInitialization()
// generateTranslations()
