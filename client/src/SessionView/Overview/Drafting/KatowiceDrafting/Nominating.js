import { CircularProgress, IconButton, Typography } from '@material-ui/core'
import { Forward as ForwardIcon } from '@material-ui/icons'
import { useState } from 'react'
import { FactionImage } from '../../../../shared/FactionImage'
import { FactionNutshell } from '../../FactionNutshell'
import { FactionButton } from '../components/FactionButton'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'

export function Nominating({ initialPool, pickBans, nominations }) {
  const [nutshellFactionKey, setFactionNutshellKey] = useState(null)
  const [pool, setPool] = useState(() =>
    initialPool.map((faction) => ({
      faction,
      nominated: nominations.some((nom) => nom.choice === faction),
      confirmed: nominations.some(
        (nom) => nom.choice === faction && nom.action === 'confirm',
      ),
      banned: pickBans.some(
        (pb) => pb.choice === faction && pb.action === 'ban',
      ),
      picked: pickBans.some(
        (pb) => pb.choice === faction && pb.action === 'pick',
      ),
      by: pickBans.some((pb) => pb.choice === faction).player,
    })),
  )
  const untouched = pool.filter((p) => !p.nominated && !p.confirmed)
  const nominated = pool.filter((p) => p.nominated && !p.confirmed)
  const confirmed = pool.filter((p) => p.confirmed)

  const [selected, setSelected] = useState(null)
  const loading = false

  const columnStyles = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gridRowGap: '0.5em',
  }

  const nominate = (factionKey) => {
    setPool((state) =>
      state.map((a) =>
        a.faction === factionKey
          ? {
              ...a,
              nominated: true,
            }
          : a,
      ),
    )

    setSelected(null)
  }

  const confirm = (factionKey) => {
    setPool((state) =>
      state.map((a) =>
        a.faction === factionKey
          ? {
              ...a,
              confirmed: true,
            }
          : a,
      ),
    )

    setSelected(null)
  }

  const steps = nominations.map(({ choice, ...rest }) => ({
    ...rest,
    choice: !choice ? null : (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: '100%' }}
      />
    ),
  }))

  return (
    <>
      <PlayerActionsStepper steps={steps} />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          gridColumnGap: '80px',
        }}
      >
        <div style={columnStyles}>
          <Typography style={{ textAlign: 'center' }}>Factions</Typography>
          {untouched.map(({ faction, banned, picked }) => (
            <div style={{ position: 'relative' }}>
              <FactionButton
                key={faction}
                banned={banned}
                disabled={loading}
                factionKey={faction}
                onClick={() => setSelected(faction)}
                onInfoClick={() => setFactionNutshellKey(faction)}
                picked={picked}
                selected={selected === faction}
              />
              {selected === faction && (
                <ForwardButton
                  loading={loading}
                  onClick={() => nominate(faction)}
                />
              )}
            </div>
          ))}
        </div>
        <div style={columnStyles}>
          <Typography style={{ textAlign: 'center' }}>Nominated</Typography>
          {nominated.map(({ faction }) => (
            <div style={{ position: 'relative' }}>
              <FactionButton
                key={faction}
                disabled={loading}
                factionKey={faction}
                highlighted
                onClick={() => setSelected(faction)}
                onInfoClick={() => setFactionNutshellKey(faction)}
                selected={selected === faction}
              />
              {selected === faction && (
                <ForwardButton
                  loading={loading}
                  onClick={() => confirm(faction)}
                />
              )}
            </div>
          ))}
        </div>
        <div style={columnStyles}>
          <Typography style={{ textAlign: 'center' }}>
            Confirmed (in draft pool)
          </Typography>
          {confirmed.map(({ faction }) => (
            <FactionButton
              key={faction}
              disabled
              factionKey={faction}
              onClick={() => setSelected(faction)}
              onInfoClick={() => setFactionNutshellKey(faction)}
              picked
              selected={selected === faction}
            />
          ))}
        </div>
      </div>
      <FactionNutshell
        factionKey={nutshellFactionKey}
        onClose={() => setFactionNutshellKey(null)}
      />
    </>
  )
}

function ForwardButton({ onClick, loading }) {
  return (
    <IconButton
      color="secondary"
      disabled={loading}
      onClick={onClick}
      style={{ position: 'absolute', left: '100%' }}
      title="nominate"
    >
      {loading && <CircularProgress color="secondary" />}
      {!loading && <ForwardIcon fontSize="large" />}
    </IconButton>
  )
}
