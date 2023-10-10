import { Grid } from '@material-ui/core'
import speakerFront from '../../../../assets/speaker-front.png'
import speakerBack from '../../../../assets/speaker-back.png'

export function SpeakerSelectorToggle({
  selected,
  onChange,
  disabled,
  cannotSelect,
}) {
  const onClick = () => {
    onChange(!selected)
  }

  return (
    <Grid container justifyContent="center" spacing={4}>
      <Grid item>
        <div
          onClick={onClick}
          style={{
            cursor: disabled || cannotSelect ? 'auto' : 'pointer',
            borderRadius: '2%',
            width: '200px',
            height: '81px',
            backgroundSize: '100% auto',
            border: `2px solid ${selected ? '#f50057' : 'transparent'}`,
            opacity: !selected || disabled || cannotSelect ? 0.7 : 1,
            backgroundImage: cannotSelect
              ? `url(${speakerBack})`
              : `url(${speakerFront})`,
          }}
          title={cannotSelect ? 'already selected' : 'select speaker'}
        />
      </Grid>
    </Grid>
  )
}
