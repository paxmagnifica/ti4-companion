// scraping source:
// https://twilight-imperium.fandom.com/wiki/Agenda_Cards
// use in developer tools on the page above
function scrapeDataInBrowser() {
  const getCards = (articleTable, version, type, excludedCards) => {
    const [_ignored, ...rows] = articleTable.querySelectorAll('tr')
    return rows.map(row => {
      const [name, election, effect] = row.querySelectorAll('td')
      return {
        name: name?.innerText.trim().replace(/\n/g, ''),
        election: election?.innerText.trim().replace(/\n/g, ''),
        effect: effect?.innerText.trim().replace(/\n/g, ''),
        version,
        type,
        excludedFrom: excludedCards.includes(name?.innerText.trim()) ? 'GameVersion.PoK' : '',
      }
    })
  }

  const getPokCards = (articleTable) => {
    const [_ignored, ...rows] = articleTable.querySelectorAll('tr')
    return rows.map(row => {
      const [name, type, election, effect] = row.querySelectorAll('td')
      return {
        name: name?.innerText.trim().replace(/\n/g, ''),
        election: election?.innerText.trim().replace(/\n/g, ''),
        effect: effect?.innerText.trim().replace(/\n/g, ''),
        version: 'GameVersion.PoK',
        type: type?.innerText.trim() === 'LAW' ? 'AgendaType.Law' : 'AgendaType.Directive',
      }
    })
  }

  const lists = [...document.querySelectorAll('ul:not([class])')].reverse()
  const excludedFromPoK = [...lists[0].querySelectorAll('li')].map(li => li.innerText.trim().replace(/\n/g, ''))

  const [baseGameLaws, baseGameDirectives, pokAgendas] = document.querySelectorAll('.article-table')
  const raw = [
    ...getCards(baseGameLaws, 'GameVersion.Base', 'AgendaType.Law', excludedFromPoK),
    ...getCards(baseGameDirectives, 'GameVersion.Base', 'AgendaType.Directive', excludedFromPoK),
    ...getPokCards(pokAgendas)
  ]

  const agendaCards = []
  raw.forEach(rawCard => {
    if (rawCard.name.startsWith('AGAINST')) {
      const lastIndex = agendaCards.length - 1
      const lastCard = agendaCards[lastIndex]
      lastCard.effect = `${lastCard.effect}\n${rawCard.name}`
      agendaCards[lastIndex] = lastCard

      return
    }

    if (!rawCard.name) {
      return
    }

    agendaCards.push(rawCard)
  })

  return agendaCards
}

// paste here the result of the above script in browser
const scrapedData = [
  {
    "name": "Anti-Intellectual Revolution",
    "election": "-",
    "effect": "FOR : After a player researches a technology, they must destroy 1 of their non-fighter ships.\\nAGAINST : At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Classified Document Leaks",
    "election": "ScoredSecretObjective",
    "effect": "When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deckThe elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Committee Formation",
    "election": "Player",
    "effect": "The elected player gains this card.Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Conventions of War",
    "election": "-",
    "effect": "FOR : Players cannot use BOMBARDMENT against units that are on cultural planets.\\nAGAINST : Each player that voted \"Against\" discards all of their action cards.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Core Mining",
    "election": "HazardousPlanet",
    "effect": "Attach this card to the elected planet's card. Then, destroy 1 infantry on the planet.The resource value of this planet is increased by 2.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Demilitarized Zone",
    "election": "CulturalPlanet",
    "effect": "Attach this card to the elected planet's card. Then, destroy all units on that planet.Player's units cannot land, be produced, or be placed on this planet.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Enforced Travel Ban",
    "election": "-",
    "effect": "FOR : Alpha and beta wormholes have no effect during movement.\\nAGAINST : Destroy each PDS in or adjacent to a system that contains a wormhole.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Executive Sanctions",
    "election": "-",
    "effect": "FOR : Each player can have a maximum of 3 action cards in their hand.\\nAGAINST : Each player discards 1 random action card from their hand.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Fleet Regulations",
    "election": "-",
    "effect": "FOR : Each player cannot have more than 4 tokens in their fleet pool.\\nAGAINST : Each player places 1 command token from their reinforcements in their fleet pool.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Holy Planet of Ixth",
    "election": "CulturalPlanet",
    "effect": "Attach this card to the elected planet's card. The planet's owner gains 1Victory Point . Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 Victory Point . When a player loses control of this planet, they lose 1 Victory Point",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Homeland Defense Act",
    "election": "-",
    "effect": "FOR : Each player can have any number of PDS units on planets they control.\\nAGAINST : Each player destroys 1 of their PDS unit.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Imperial Arbiter",
    "election": "Player",
    "effect": "The elected player gains this card.At the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Commerce",
    "election": "Player",
    "effect": "The elected player gains this card.After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Exploration",
    "election": "Player",
    "effect": "The elected player gains this card.When the owner of this card gains control of a planet, they gain 1 trade good.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Industry",
    "election": "Player",
    "effect": "The elected player gains this card.When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Peace",
    "election": "Player",
    "effect": "The elected player gains this card.After a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Policy",
    "election": "Player",
    "effect": "The elected player gains this card.At the end of the status phase, the owner of this card draws 1 action card.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of Sciences",
    "election": "Player",
    "effect": "The elected player gains this card.When the owner of this card resolves the primary or secondary ability of the \"Technology\" strategy card, they do not need to spend resources to research technology.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Minister of War",
    "election": "Player",
    "effect": "The elected player gains this card.The owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Prophecy of Ixth",
    "election": "Player",
    "effect": "The elected player gains this card.The owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Publicize Weapon Schematics",
    "election": "-",
    "effect": "FOR : If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE\\nAGAINST : Each player that owns a war sun technology discards all of their action cards.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Regulated Conscription",
    "election": "-",
    "effect": "FOR : When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.\\nAGAINST : No effect",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Representative Government",
    "election": "-",
    "effect": "FOR : Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead.\\nAGAINST : At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Research Team: Biotic",
    "election": "Industrial Planet",
    "effect": "Attach this card to the elected planet's card.When the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Research Team:Cybernetic",
    "election": "Industrial Planet",
    "effect": "Attach this card to the elected planet's card.When the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Research Team: Propulsion",
    "election": "Industrial Planet",
    "effect": "Attach this card to the elected planet's card.When the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Research Team: Warfare",
    "election": "HazardousPlanet",
    "effect": "Attach this card to the elected planet's card.When the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Senate Sanctuary",
    "election": "CulturalPlanet",
    "effect": "Attach this card to the elected planet's card.The influence value of this planet is increased by 2.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Shard of the Throne",
    "election": "Player",
    "effect": "The elected player gains this card and 1 Victory Point .A player gains this card and 1 Victory Point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 Victory Point .",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Shared Research",
    "election": "-",
    "effect": "FOR : Each player's units can move through nebulae.\\nAGAINST : Each player places a command token from their reinforcements in their home system, if able.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Terraforming Initiative",
    "election": "HazardousPlanet",
    "effect": "Attach this card to the elected planet's card.The resource and influence values of this planet are increased by 1.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "The Crown of Emphidia",
    "election": "Player",
    "effect": "The elected player gains this card and 1 Victory Point .A player gains this card and 1 Victory Point after they gain control of a planet in the home system of this card's owner. Then, the previous owner of this card loses 1 Victory Point .",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "The Crown of Thalnos",
    "election": "Player",
    "effect": "The elected player gains this card.During each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll.(Typo: The card itself says \"The Crown of Thanlos,\" but rules referring to it use the correct name.)",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": "GameVersion.PoK"
  },
  {
    "name": "Wormhole Reconstruction",
    "election": "-",
    "effect": "FOR : All systems that contain either an alpha or beta wormhole are adjacent to each other.\\nAGAINST : Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Law",
    "excludedFrom": ""
  },
  {
    "name": "Archived Secret",
    "election": "Player",
    "effect": "Elected player draws 1 secret objective.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Arms Reduction",
    "election": "-",
    "effect": "FOR : Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers.\\nAGAINST : At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Colonial Redistribution",
    "election": "Non-home,non-Mecatol Rex planet",
    "effect": "Destroy each unit on the elected planet. Then, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Compensated Disarmament",
    "election": "Planet",
    "effect": "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Economic Equality",
    "election": "-",
    "effect": "FOR : Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.\\nAGAINST : Each player returns all of their trade goods to the supply.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Incentive Program",
    "election": "-",
    "effect": "FOR : Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.\\nAGAINST : Draw and reveal 1 stage II public objective from the deck and place it near the public objectives.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Ixthian Artifact",
    "election": "-",
    "effect": "FOR : The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems.\\nAGAINST : No effect",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Judicial Abolishment",
    "election": "Law",
    "effect": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deckDiscard the elected law from play.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Miscount Disclosed",
    "election": "Law",
    "effect": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deckVote on the elected law as if it were just revealed from the top of the deck.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Mutiny",
    "election": "-",
    "effect": "FOR : Each player who voted \"For\" gains 1 Victory Point .\\nAGAINST : Each player who voted \"For\" loses 1 Victory Point .",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "New Constitution",
    "election": "-",
    "effect": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "FOR : Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system",
    "effect": "undefined\\nAGAINST : No effect",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Public Execution",
    "election": "Player",
    "effect": "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Seed of an Empire",
    "election": "-",
    "effect": "FOR : The player with most Victory Point gains 1 Victory Point .\\nAGAINST : The player with the fewest Victory Point gains 1 Victory Point .",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Swords to Plowshares",
    "election": "-",
    "effect": "FOR : Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.\\nAGAINST : Each player places 1 infantry from their reinforcements on each planet they control.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Unconventional Measures",
    "election": "-",
    "effect": "FOR : Each player that voted \"For\" draws 2 action cards.\\nAGAINST : Each player that voted \"For\" discards all of their action cards.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Wormhole Research",
    "election": "-",
    "effect": "FOR : Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole\\nAGAINST : Each player that voted \"Against\" removes 1 command token from their command sheet and returns it to their reinforcements.",
    "version": "GameVersion.Base",
    "type": "AgendaType.Directive",
    "excludedFrom": ""
  },
  {
    "name": "Articles of War",
    "election": "-",
    "effect": "FOR : All mechs lose their printed abilities except for SUSTAIN DAMAGE\\nAGAINST : Each player that voted \"For\" gains 3 trade goods",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Checks and Balances",
    "election": "-",
    "effect": "FOR : When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have one (or a player that does not have two in a 3 or 4 playergame), if able\\nAGAINST : Each player readies only 3 of their planets at the end of this agenda phase",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Nexus Sovereignty",
    "election": "-",
    "effect": "FOR : Alpha and Beta wormholes in the Wormhole Nexus have no effect during movement\\nAGAINST : Place a Gamma Wormhole Token in the Mecatol Rex System",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Political Censure",
    "election": "Player",
    "effect": "The elected player gains this card and 1 Victory Point.The elected player cannot play action cards.If the owner of this card loses this card, they lose 1 Victory Point",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Representative Government",
    "election": "-",
    "effect": "FOR : Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes\\nAGAINST : At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Search Warrant",
    "election": "Player",
    "effect": "The elected player gains this card and draws 2 Secret Objectives.The owner of this card plays with their secret objectives revealed",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Law"
  },
  {
    "name": "Armed Forces Standardization",
    "election": "Player",
    "effect": "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Clandestine Operations",
    "election": "-",
    "effect": "FOR : Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements\\nAGAINST : Each player removes 1 command token from their fleet pool and returns that token to their reinforcements",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Covert Legislation",
    "election": "-",
    "effect": "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players. Instead, the speaker reads the eligible outcomes aloud (For, Against, Elect Player etc.); the other players vote for these outcomes as if they were outcomes of this agenda without knowing their effects",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Galactic Crisis Pact",
    "election": "Strategy Card",
    "effect": "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Minister of Antiques",
    "election": "Player",
    "effect": "The elected player gains 1 relic",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Rearmament Agreement",
    "election": "-",
    "effect": "FOR : Each player places 1 Mech from their reinforcements on a planet they control in their home system\\nAGAINST : Each player replaces each of their mechs with 1 infantry from their reinforcements",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  },
  {
    "name": "Research Grant Reallocation",
    "election": "Player",
    "effect": "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements",
    "version": "GameVersion.PoK",
    "type": "AgendaType.Directive"
  }
]

const slugify = t => t.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')

const generateDbInitialization = () => {
  scrapedData.forEach(datum => console.log(`new Agenda("${slugify(datum.name)}",${datum.version},${datum.type},"${datum.election}","${datum.effect}"${datum.excludedFrom ? `,${datum.excludedFrom}` : ''}),`))
}

const generateTranslations = () => {
  scrapedData.forEach(datum => console.log(`'${slugify(datum.name)}': { slug: '${slugify(datum.name)}', name: '${datum.name}', election: '${datum.election?.replace(/\'/g, '\\\'')}', effect: '${datum.effect?.replace(/\'/g, '\\\'')}'},`))
}

generateDbInitialization()
generateTranslations()
