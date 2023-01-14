import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Button } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import { useTranslation, Trans } from '../i18n'
import Dreadnought from '../assets/units/unit_dreadnought.png'
import Cruiser from '../assets/units/unit_cruiser.png'
import Destroyer from '../assets/units/unit_destroyer.png'
import Dice from '../assets/units/unit_dice.png'
import Fighter from '../assets/units/unit_fighter.png'
import Flagship from '../assets/units/unit_flagship.png'
import Infantry from '../assets/units/unit_infantry.png'
import Mech from '../assets/units/unit_mech.png'
import PDS from '../assets/units/unit_pds.png'
import Transporter from '../assets/units/unit_transporter.png'
import Warsun from '../assets/units/unit_warsun.png'

import { Rolls } from './Rolls'

const ALL_UNITS = [
  Transporter,
  Destroyer,
  Fighter,
  Cruiser,
  Dreadnought,
  Flagship,
  Warsun,
  PDS,
  Infantry,
  Mech,
  Dice,
]

const rollDice = (sides = 10) => Math.floor(Math.random() * sides) + 1

export function DiceRoller({ onRolled, onCleared }) {
  const [diceCounts, setDiceCounts] = useState(Array(ALL_UNITS.length).fill(0))
  const [rolls, setRolls] = useState([])
  const [highlights, setHighlights] = useState([])
  const rolled = rolls.some((x) => x.length > 0)
  const readyToRoll = diceCounts.some((dice) => dice > 0)

  const addDice = (index) =>
    setDiceCounts((currentCounts) => {
      const copy = [...currentCounts]
      copy[index] += 1

      return copy
    })

  const removeDice = (index) =>
    setDiceCounts((currentCounts) => {
      const copy = [...currentCounts]
      copy[index] -= 1

      return copy
    })

  const clear = () => {
    setRolls([])
    setDiceCounts(Array(ALL_UNITS.length).fill(0))
    setHighlights([])
    if (onCleared) {
      onCleared()
    }
  }

  const roll = () => {
    const newRolls = diceCounts.map((count) =>
      count > 0 ? [...Array(count)].map(rollDice) : [],
    )

    setRolls(newRolls)
    if (onRolled) {
      onRolled()
    }
  }

  return (
    <>
      {!rolled && (
        <>
          <DiceCountSelector
            addDice={addDice}
            diceCounts={diceCounts}
            removeDice={removeDice}
          />
          <Button
            color="secondary"
            disabled={!readyToRoll}
            onClick={roll}
            style={{
              marginTop: '2em',
              width: '50%',
              marginLeft: '25%',
              height: '6vh',
            }}
            variant="contained"
          >
            <Trans i18nKey="letsFight.roll" />
          </Button>
        </>
      )}
      {rolled && (
        <>
          <RollsList
            diceCounts={diceCounts}
            highlights={highlights}
            rolls={rolls}
            setHighlights={setHighlights}
          />
          <Button
            color="secondary"
            disabled={!readyToRoll}
            onClick={clear}
            style={{
              marginTop: '2em',
              width: '50%',
              marginLeft: '25%',
              height: '6vh',
            }}
            variant="contained"
          >
            <Trans i18nKey="letsFight.clear" />
          </Button>
        </>
      )}
    </>
  )
}

function DiceCountSelector({ addDice, removeDice, diceCounts }) {
  const { t } = useTranslation()

  const allUnitsNames = ALL_UNITS.map((_, index) => t(`kb.units.${index}`))

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gridRowGap: '1.5em' }}>
      {ALL_UNITS.map((unitSrc, index) => (
        <div
          key={unitSrc}
          style={{
            display: 'flex',
            gridColumnGap: '0.5em',
            alignItems: 'center',
            width: '50%',
          }}
        >
          <IconButton
            onClick={() => addDice(index)}
            style={{ margin: 0, padding: '0.2vh' }}
          >
            <img
              alt={allUnitsNames[index]}
              src={unitSrc}
              style={{ maxHeight: '6.8vh' }}
            />
          </IconButton>
          <div style={{ fontSize: '1.2em' }}>{diceCounts[index]}</div>
          {diceCounts[index] > 0 && (
            <IconButton
              color="secondary"
              onClick={() => removeDice(index)}
              variant="contained"
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          )}
        </div>
      ))}
    </div>
  )
}

function RollsList({ diceCounts, rolls, highlights, setHighlights }) {
  const setHighlightsFor = (index, setter) => {
    setHighlights((highlighted) => {
      const copy = [...highlighted]
      copy[index] = setter(copy[index] || [])

      return copy
    })
  }

  const { t } = useTranslation()

  const allUnitsNames = ALL_UNITS.map((_, index) => t(`kb.units.${index}`))

  return (
    <>
      {ALL_UNITS.map((unitSrc, index) =>
        diceCounts[index] > 0 ? (
          <div
            key={unitSrc}
            style={{
              display: 'flex',
              gridColumnGap: '0.5em',
              alignItems: 'center',
            }}
          >
            <IconButton style={{ margin: 0, padding: '0.2vh' }}>
              <img
                alt={allUnitsNames[index]}
                src={unitSrc}
                style={{ maxHeight: '6.8vh' }}
              />
            </IconButton>
            <div>
              {rolls[index]?.length > 0 && (
                <Rolls
                  highlights={highlights[index] || []}
                  rolls={rolls[index]}
                  setHighlights={(setter) => setHighlightsFor(index, setter)}
                />
              )}
            </div>
          </div>
        ) : null,
      )}
      <div
        style={{
          textAlign: 'center',
          fontSize: '1.3em',
        }}
      >
        <Trans
          i18nKey="letsFight.hits"
          values={{ hits: highlights.flat().filter((h) => h).length }}
        />
      </div>
    </>
  )
}
