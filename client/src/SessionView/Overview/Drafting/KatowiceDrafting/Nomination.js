import { CircularProgress, IconButton, Typography } from '@material-ui/core'
import { Forward as ForwardIcon } from '@material-ui/icons'
import { useCallback, useState } from 'react'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { FactionImage } from '../../../../shared/FactionImage'
import { FactionNutshell } from '../../FactionNutshell'
import { FactionButton } from '../components/FactionButton'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { useDraftMutation } from '../queries'

export function Nomination({
  initialPool,
  pickBans,
  nominations,
  sessionService,
  sessionId,
}) {
  const [nutshellFactionKey, setFactionNutshellKey] = useState(null)
  const { playerIndex } = nominations.find(({ choice }) => choice === null)
  const pool = initialPool.map((faction) => ({
    faction,
    nominated: nominations.some((nom) => nom.choice === faction),
    confirmed: nominations.some(
      (nom) => nom.choice === faction && nom.action === 'confirm',
    ),
    banned: pickBans.some((pb) => pb.choice === faction && pb.action === 'ban'),
    picked: pickBans.some(
      (pb) => pb.choice === faction && pb.action === 'pick',
    ),
    by: pickBans.some((pb) => pb.choice === faction).player,
  }))
  const untouched = pool.filter((p) => !p.nominated && !p.confirmed)
  untouched.sort((a, b) => {
    if (!a.banned && !a.picked && (b.banned || b.picked)) {
      return -1
    }

    if (a.picked && b.banned) {
      return -1
    }

    return 0
  })
  const nominated = pool.filter((p) => p.nominated && !p.confirmed)
  const confirmed = pool.filter((p) => p.confirmed)

  const [selected, setSelected] = useState(null)

  const columnStyles = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gridRowGap: '0.5em',
  }

  const { setError } = useDomainErrors()
  const nominationMutation = useCallback(
    async (action) => {
      try {
        await sessionService.pushEvent(sessionId, {
          type: 'Nomination',
          payload: {
            action,
            faction: selected,
            playerIndex,
          },
        })
        setSelected(null)
      } catch (e) {
        setError(e)
      }
    },
    [sessionId, setError, sessionService, selected, playerIndex],
  )

  const { mutate: nominate, isLoading: loading } = useDraftMutation({
    sessionId,
    mutation: nominationMutation,
  })

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
            <div key={faction} style={{ position: 'relative' }}>
              <FactionButton
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
                  onClick={() => nominate('nominate')}
                />
              )}
            </div>
          ))}
        </div>
        <div style={columnStyles}>
          <Typography style={{ textAlign: 'center' }}>Nominated</Typography>
          {nominated.map(({ faction }) => (
            <div key={faction} style={{ position: 'relative' }}>
              <FactionButton
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
                  onClick={() => nominate('confirm')}
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
