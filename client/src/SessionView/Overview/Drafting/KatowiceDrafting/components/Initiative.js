import { Typography } from '@material-ui/core'
import speakerFront from '../../../../../assets/speaker-front.png'

export function Initiative({ at, height }) {
  if (at === 1) {
    return <img src={speakerFront} style={{ height: height || '100%', width: 'auto' }} />
  }

  if (at === 2) {
    return <Typography>2nd</Typography>
  }

  if (at === 3) {
    return <Typography>3rd</Typography>
  }

  return <Typography>{at}th</Typography>
}
