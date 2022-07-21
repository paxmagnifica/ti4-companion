import { useState, useMemo } from 'react'
import clsx from 'clsx'
import { Grid, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from '../../i18n'
import useSmallViewport from '../../shared/useSmallViewport'
import DebouncedTextField from '../../shared/DebouncedTextField'

import Tech from './Tech'
import { useTechs } from './queries'

function TechnologyCardsProvider(props) {
  const { techs, queryInfo } = useTechs()

  if (!queryInfo.isFetched) {
    return <CircularProgress color="secondary" />
  }

  return <TechnologyCards availableTechs={techs} {...props} />
}

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: '0 auto',
  },
  filtering: {
    marginLeft: theme.spacing(1),
  },
  hide: {
    visibility: 'hidden',
  },
}))

function TechnologyCards({ availableTechs }) {
  const classes = useStyles()
  const smallViewport = useSmallViewport()
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const filtered = useMemo(() => {
    const withMeta = Object.values(availableTechs).map((availableRelic) => ({
      ...availableRelic,
      title: t(`techs.${availableRelic.slug}.title`),
      effect: t(`techs.${availableRelic.slug}.effect`),
    }))

    return withMeta.filter(
      (obj) =>
        obj.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        obj.effect.toLowerCase().includes(searchValue.toLowerCase()),
    )
  }, [availableTechs, searchValue, t])

  return (
    <Grid
      className={classes.grid}
      container
      justifyContent={smallViewport ? 'center' : 'flex-start'}
      spacing={2}
    >
      <Grid item xs={12}>
        <Grid alignItems="center" container justifyContent="center">
          <DebouncedTextField
            onChange={setSearchValue}
            placeholder={t('general.labels.search')}
            setLoading={setFiltering}
          />
          <CircularProgress
            className={clsx(classes.filtering, { [classes.hide]: !filtering })}
            color="secondary"
            size={18}
          />
        </Grid>
      </Grid>
      {filtered.map((card) => (
        <Grid key={card.slug} item>
          <Tech
            {...card}
            highlight={searchValue.split(' ')}
            small={smallViewport}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default TechnologyCardsProvider
