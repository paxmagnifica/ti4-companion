import {
  Dialog,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { Person as CheckPlayersIcon, Map as MapIcon } from '@material-ui/icons'
import { useCallback, useState, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { ColorBox } from '../../../../shared'
import PlayerFlag from '../../../PlayerFlag'
import { useSessionContext } from '../../../useSessionContext'
import { Initiative } from './components/Initiative'

export function CheckPlayerPicks() {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((s) => !s), [])

  const {
    session: { players, mapPositions },
  } = useSessionContext()

  const playersWithTablePosition = useMemo(
    () =>
      players.map((p) => ({
        ...p,
        tablePosition: mapPositions[p.atTable],
      })).sort((a, b) => {
        if (a.initiative <= 0 && b.initiative <= 0) {
          return 0
        }

        if (a.initiative > 0 && b.initiative <= 0) {
          return -1
        }

        if (a.initiative <= 0 && b.initiative > 0) {
          return 1
        }

        return (a.initiative - b.initiative);
      }),
    [players],
  )

  return (
    <>
      <Button
        endIcon={<CheckPlayersIcon />}
        onClick={toggle}
        style={{ height: '40px' }}
        variant="contained"
      >
        <Trans i18nKey="drafting.checkPicks" />
      </Button>
      <Dialog onClose={toggle} open={open}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans i18nKey="general.labels.player" />
                </TableCell>
                <TableCell>R1 initiative</TableCell>
                <TableCell>
                  <Trans i18nKey="general.labels.faction" />
                </TableCell>
                <TableCell>
                  <Trans i18nKey="general.labels.tablePosition" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersWithTablePosition.map((player) => (
                <TableRow key={player.playerName}>
                  <TableCell component="th" scope="row">
                    {player.playerName}
                  </TableCell>
                  <TableCell>
                    <Initiative
                      at={player.initiative}
                      height="30px"
                      maxWidth="4em"
                    />
                  </TableCell>
                  <TableCell>
                    {!player.faction ? (
                      '-'
                    ) : (
                      <PlayerFlag
                        disabled
                        factionKey={player.faction}
                        height="2em"
                        selected
                        width="3em"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {!player.tablePosition ? (
                      '-'
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gridColumnGap: '0.1em',
                        }}
                      >
                        <ColorBox color={player.tablePosition.color} inline />
                        {player.tablePosition.name}
                        <MapIcon />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </>
  )
}
