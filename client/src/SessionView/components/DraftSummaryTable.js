import { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core'
import { Trans, useTranslation } from 'react-i18next'

import { MapPreview } from './MapPreview'
import FactionFlag from '../../shared/FactionFlag'

export function DraftSummaryTable({ withTablePositions, map, picks, speaker }) {
  const { t } = useTranslation()

  const showMap = withTablePositions && map
  const sortedPicks = useMemo(() => {
    if (withTablePositions) {
      const memoized = [...picks]

      memoized.sort((a, b) => a.tablePosition - b.tablePosition)

      return memoized
    }

    return picks
  }, [picks, withTablePositions])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans i18nKey="general.labels.player" />
            </TableCell>
            <TableCell>
              <Trans i18nKey="general.labels.faction" />
            </TableCell>
            {withTablePositions && (
              <TableCell>
                <Trans i18nKey="general.labels.tablePosition" />
                {showMap && <MapPreview map={map} />}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPicks.map((pick) => (
            <TableRow key={pick.playerName}>
              <TableCell component="th" scope="row">
                {pick.playerName}{' '}
                <em>
                  {pick.playerName === speaker
                    ? `(${t('general.labels.speaker')})`
                    : ''}
                </em>
              </TableCell>
              <TableCell>
                <FactionFlag
                  disabled
                  factionKey={pick.faction}
                  height="3em"
                  selected
                  width="4.5em"
                />
              </TableCell>
              {withTablePositions && (
                <TableCell>P{pick.tablePosition + 1}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

DraftSummaryTable.propTypes = {
  picks: PropTypes.arrayOf(
    PropTypes.shape({
      faction: PropTypes.string.isRequired,
      playerName: PropTypes.string.isRequired,
      tablePosition: PropTypes.number,
    }),
  ).isRequired,
  speaker: PropTypes.string.isRequired,
}
