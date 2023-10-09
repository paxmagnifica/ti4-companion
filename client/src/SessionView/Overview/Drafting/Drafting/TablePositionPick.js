import { Grid, Button, Typography, makeStyles } from '@material-ui/core'
import { PanTool as PickIcon } from '@material-ui/icons'
import clsx from 'clsx'
import {
  ColorBox,
  getMapPositionName,
  getMapPositionColor,
} from '../../../../shared'
import { EditPrompt } from '../../../Edit'

const useStyles = makeStyles((theme) => ({
  containedButton: {
    transition: theme.transitions.create(
      ['opacity', 'background-color', 'color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      },
    ),
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
    '&:disabled': {
      color: 'black',
      opacity: 0.5,
    },
  },
  picked: {
    backgroundColor: `${theme.palette.success.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.success.contrastText,
    },
  },
}))

export function TablePositionPick({
  disabled,
  draft,
  session,
  selectedPosition,
  handleSelectedPosition,
}) {
  const classes = useStyles()

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
            <EditPrompt fullWidth>
              <Button
                className={clsx(classes.containedButton, {
                  [classes.picked]: picked,
                })}
                color={isSelected ? 'secondary' : 'default'}
                disabled={Boolean(disabled || picked)}
                endIcon={picked ? <PickIcon fontSize="large" /> : null}
                fullWidth
                onClick={() => handleSelectedPosition(tablePositionIndex)}
                variant="contained"
              >
                <Typography
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gridColumnGap: '0.3em',
                  }}
                >
                  {getMapPositionName({
                    mapPositions: session.mapPositions,
                    position: tablePositionIndex,
                  })}
                  <ColorBox
                    color={getMapPositionColor({
                      mapPositions: session.mapPositions,
                      position: tablePositionIndex,
                    })}
                    disabled
                  />
                </Typography>
                {picked && (
                  <Typography style={{ marginLeft: '0.3em' }} variant="caption">
                    picked by {picked.playerName}
                  </Typography>
                )}
              </Button>
            </EditPrompt>
          </Grid>
        )
      })}
    </Grid>
  )
}
