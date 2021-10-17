import { useState, useMemo, useEffect, useContext } from 'react'
import clsx from 'clsx'
import {
  Grid,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import { DispatchContext, StateContext } from '../../state'
import useSmallViewport from '../../shared/useSmallViewport'
import DebouncedTextField from '../../shared/DebouncedTextField'

import * as explorationCardsService from './service'
import ExplorationCard, { PLANET_TYPE } from './ExplorationCard'

function ExplorationCardsProvider(props) {
  const { explorationCards: { loading, loaded, data: availableCards }} = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (loading || loaded) {
      return
    }

    const get = async () => {
      dispatch({ type: 'LoadingExplorationCards' })
      const cards = await explorationCardsService.getAll()

      dispatch({ type: 'LoadExplorationCards', explorationCards: cards })
    }

    get()
  }, [loaded, loading, dispatch])

  if (!loaded) {
    return null
  }

  if (loading) {
    <CircularProgress color='secondary' />
  }

  return <ExplorationCards availableCards={availableCards} {...props} />
}

const useStyles = makeStyles(theme => ({
  grid: {
    margin: '0 auto',
  },
  filtering: {
    marginLeft: theme.spacing(1),
  },
  hide: {
    visibility: 'hidden',
  }
}))

function ExplorationCards({
  availableCards,
  onFilterChange,
  cultural,
  industrial,
  hazardous,
  frontier,
}) {
  const { t } = useTranslation()
  const classes = useStyles()
  const smallViewport = useSmallViewport()

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const filtered = useMemo(() => {
    const withMeta = Object.values(availableCards).map(availableCard => ({
      ...availableCard,
      title: t(`explorationCards.${availableCard.slug}.title`),
      effect: t(`explorationCards.${availableCard.slug}.effect`),
    }))

    return [
      ...(cultural ? withMeta.filter(obj => obj.planetType === PLANET_TYPE.cultural) : []),
      ...(industrial ? withMeta.filter(obj => obj.planetType === PLANET_TYPE.industrial) : []),
      ...(hazardous ? withMeta.filter(obj => obj.planetType === PLANET_TYPE.hazardous) : []),
      ...(frontier ? withMeta.filter(obj => obj.planetType === PLANET_TYPE.frontier) : []),
    ].filter(obj =>
      obj.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      obj.effect.toLowerCase().includes(searchValue.toLowerCase()) )
  }, [availableCards, searchValue, cultural, industrial, hazardous, frontier, t]);

  return <Grid
    className={classes.grid}
    justifyContent={smallViewport ? 'center' : 'flex-start'}
    container
    spacing={2}
  >
    <Grid item xs={12} sm={6}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
      >
        <DebouncedTextField
          placeholder={t('general.labels.search')}
          onChange={setSearchValue}
          setLoading={setFiltering}
        />
        <CircularProgress
          color='secondary'
          size={18}
          className={clsx(classes.filtering, { [classes.hide]: !filtering })}
        />
      </Grid>
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={cultural} onChange={() => onFilterChange(filters => ({ ...filters, cultural: !filters.cultural}))} />}
          label={t('kb.panels.exploration.types.cultural')}
        />
        <FormControlLabel
          control={<Checkbox checked={industrial} onChange={() => onFilterChange(filters => ({ ...filters, industrial: !filters.industrial}))} />}
          label={t('kb.panels.exploration.types.industrial')}
        />
        <FormControlLabel
          control={<Checkbox checked={hazardous} onChange={() => onFilterChange(filters => ({ ...filters, hazardous: !filters.hazardous}))} />}
          label={t('kb.panels.exploration.types.hazardous')}
        />
        <FormControlLabel
          control={<Checkbox checked={frontier} onChange={() => onFilterChange(filters => ({ ...filters, frontier: !filters.frontier}))} />}
          label={t('kb.panels.exploration.types.frontier')}
        />
      </FormGroup>
    </Grid>
    {filtered.map(card => <Grid item key={card.slug}>
      <ExplorationCard
        {...card}
        small={smallViewport}
        highlight={searchValue.split(' ')}
      />
    </Grid>)}
  </Grid>
}

export default ExplorationCardsProvider
