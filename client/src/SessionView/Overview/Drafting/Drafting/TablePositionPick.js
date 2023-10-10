import { Grid } from '@material-ui/core'
import { getMapPositionName, getMapPositionColor } from '../../../../shared'
import { TablePositionButton } from '../components/TablePositionButton'

export function TablePositionPick({
  disabled,
  draft,
  session,
  selectedPosition,
  handleSelectedPosition,
}) {
  return (
    <Grid container justifyContent="center" spacing={4}>
      {[...Array(draft.players.length).keys()].map((tablePositionIndex) => {
        const picked = draft.picks
          .filter(({ type }) => type === 'tablePosition')
          .find(({ pick: p }) => Number(p) === tablePositionIndex)
        const isSelected =
          selectedPosition !== null && selectedPosition === tablePositionIndex

        return (
          <Grid key={tablePositionIndex} item lg={3} md={4} sm={6} xs={12}>
            <TablePositionButton
              disabled={disabled}
              map={{
                name: getMapPositionName({
                  mapPositions: session.mapPositions,
                  position: tablePositionIndex,
                }),
                color: getMapPositionColor({
                  mapPositions: session.mapPositions,
                  position: tablePositionIndex,
                }),
              }}
              onClick={() => handleSelectedPosition(tablePositionIndex)}
              picked={picked}
              selected={isSelected}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}
