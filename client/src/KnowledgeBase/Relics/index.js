import { useState, useMemo, useEffect, useContext } from 'react'
import clsx from 'clsx'
import {
  Grid,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DispatchContext, StateContext } from '../../state'
import useSmallViewport from '../../shared/useSmallViewport'
import DebouncedTextField from '../../shared/DebouncedTextField'
import translations from '../../i18n'

import * as relicService from './service'

function RelicsProvider(props) {
  const { relics: { loading, loaded, data: availableRelics }} = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (loading || loaded) {
      return
    }

    const get = async () => {
      dispatch({ type: 'LoadingRelics' })
      const cards = await relicService.getAll()

      dispatch({ type: 'LoadRelics', relics: cards })
    }

    get()
  }, [loaded, loading, dispatch])

  if (!loaded) {
    return null
  }

  if (loading) {
    <CircularProgress color='secondary' />
  }

  return <Relics availableRelics={availableRelics} {...props} />
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

function Relics({
  availableRelics,
}) {
  const classes = useStyles()
  const smallViewport = useSmallViewport()

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const filtered = useMemo(() => {
    const  withMeta = translations.relicsArray.map(obj => ({ ...obj, ...availableRelics[obj.slug]}))

    return withMeta.filter(obj =>
      obj.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      obj.effect.toLowerCase().includes(searchValue.toLowerCase()) )
  }, [availableRelics, searchValue]);

  return <Grid
    className={classes.grid}
    justifyContent={smallViewport ? 'center' : 'flex-start'}
    container
    spacing={2}
  >
    <Grid item xs={12}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
      >
        <DebouncedTextField
          placeholder='search'
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
    {filtered.map(card => <Grid item key={card.slug}>
      <p>{card.slug}</p>
    </Grid>)}
  </Grid>
}

export default RelicsProvider
