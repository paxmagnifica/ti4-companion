import { Grid, Typography } from '@material-ui/core'
import { TablePositionButton } from '../../components/TablePositionButton'

export function TablePositionSelection({
  mapPositions,
  draft,
  currentPlayer,
  onSelected,
  selection,
  disabled,
}) {
  return (
    <>
      <Typography>Map</Typography>
      <Grid container justifyContent="center" spacing={4}>
        {mapPositions.map((map, index) => {
          const picked = draft.find(
            ({ action, choice }) =>
              action === 'tablePosition' && index === choice,
          )

          return (
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <TablePositionButton
                disabled={
                  disabled ||
                  draft.some(
                    ({ player, action }) =>
                      player === currentPlayer.player &&
                      action === 'tablePosition',
                  ) ||
                  draft.some(
                    ({ action, choice }) =>
                      action === 'tablePosition' && choice === index,
                  )
                }
                map={map}
                onClick={() =>
                  onSelected({ action: 'tablePosition', choice: index })
                }
                picked={picked ? { playerName: picked.player } : false}
                selected={
                  selection?.action === 'tablePosition' &&
                  selection?.choice === index
                }
              />
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
