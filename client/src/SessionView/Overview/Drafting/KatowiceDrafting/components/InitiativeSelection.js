import { Grid, Typography } from '@material-ui/core'
import { PickButton } from '../../components/PickButton'
import { Initiative } from './Initiative'

export function InitiativeSelection({
  draft,
  selection,
  onSelected,
  currentPlayer,
  disabled,
}) {
  return (
    <>
      <Typography>Initiative</Typography>
      <Grid container justifyContent="center" spacing={4}>
        {Array.from(Array(6)).map((_, index) => {
          const pick = draft.find(
            ({ action, choice }) =>
              action === 'initiative' && index + 1 === choice,
          )

          return (
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <PickButton
                disabled={
                  disabled ||
                  draft.some(
                    ({ player, action }) =>
                      player === currentPlayer.player &&
                      action === 'initiative',
                  ) ||
                  draft.some(
                    ({ action, choice }) =>
                      action === 'initiative' && choice === index + 1,
                  )
                }
                onClick={() =>
                  onSelected({ action: 'initiative', choice: index + 1 })
                }
                picked={pick ? { playerName: pick.player } : false}
                selected={
                  selection?.action === 'initiative' &&
                  selection?.choice === index + 1
                }
              >
                <Initiative at={index + 1} />
              </PickButton>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
