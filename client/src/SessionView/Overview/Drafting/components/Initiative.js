import { Typography } from '@material-ui/core'
import speakerFront from '../../../../assets/speaker-front.png'

export function Initiative({ at, height, maxWidth }) {
  if (at <= 0 || !at) {
    return <Typography>-</Typography>
  }

  if (at === 1) {
    return (
      <img
        alt="speaker"
        src={speakerFront}
        style={{ height: height || '100%', width: 'auto', maxWidth }}
      />
    )
  }

  if (at === 2) {
    return <Typography>2nd</Typography>
  }

  if (at === 3) {
    return <Typography>3rd</Typography>
  }

  return <Typography>{at}th</Typography>
}
