import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Button } from '@material-ui/core'
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1'

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

export function DiceRoller({ onRolled, onCleared, hide }) {
  const [diceCounts, setDiceCounts] = useState(Array(ALL_UNITS.length).fill(0))
  const [rolls, setRolls] = useState([])
  const rolled = rolls.some((x) => x.length > 0)
  const readyToRoll = diceCounts.some((dice) => dice > 0)
  const { t } = useTranslation()

  const allUnitsNames = ALL_UNITS.map((_, index) => t(`kb.units.${index}`))

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

  const [highlights, setHighlights] = useState([])
  const setHighlightsFor = (index, setter) => {
    setHighlights((highlighted) => {
      const copy = [...highlighted]
      copy[index] = setter(copy[index] || [])

      return copy
    })
  }

  const rollOrClear = () => {
    if (rolled) {
      setRolls([])
      setDiceCounts(Array(ALL_UNITS.length).fill(0))
      setHighlights([])
      if (onCleared) {
        onCleared()
      }

      return
    }

    const newRolls = diceCounts.map((count) =>
      count > 0 ? [...Array(count)].map(rollDice) : [],
    )

    setRolls(newRolls)
    if (onRolled) {
      onRolled()
    }
  }

  if (hide) {
    return null
  }

  return (
    <>
      <div style={{ marginBottom: '1em' }}>
        {ALL_UNITS.map((unitSrc, index) =>
          !rolled || diceCounts[index] > 0 ? (
            <div
              key={unitSrc}
              style={{
                display: 'flex',
                gridColumnGap: '0.5em',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <IconButton
                onClick={() => addDice(index)}
                style={{ margin: 0, padding: '0.2vh' }}
              >
                <img
                  alt={allUnitsNames[index]}
                  src={unitSrc}
                  style={{ maxHeight: '7vh' }}
                />
              </IconButton>
              {!rolled && (
                <div style={{ fontSize: '1.2em' }}>{diceCounts[index]}</div>
              )}
              {!rolled && diceCounts[index] > 0 && (
                <IconButton
                  color="secondary"
                  onClick={() => removeDice(index)}
                  variant="contained"
                >
                  <ExposureNeg1Icon />
                </IconButton>
              )}
              {rolls[index]?.length > 0 && (
                <Rolls
                  highlights={highlights[index] || []}
                  rolls={rolls[index]}
                  setHighlights={(setter) => setHighlightsFor(index, setter)}
                />
              )}
            </div>
          ) : null,
        )}
      </div>
      {rolled && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2em',
            fontSize: '1.3em',
          }}
        >
          <Trans
            i18nKey="letsFight.hits"
            values={{ hits: highlights.flat().filter((h) => h).length }}
          />
        </div>
      )}
      <Button
        color="secondary"
        disabled={!readyToRoll}
        onClick={rollOrClear}
        style={{
          marginBottom: '1em',
          width: '50vw',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
          height: '6vh',
        }}
        variant="contained"
      >
        <Trans i18nKey={rolled ? 'letsFight.clear' : 'letsFight.roll'} />
      </Button>
    </>
  )
}
