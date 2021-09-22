import { useMemo, useState, useContext } from 'react'
import clsx from 'clsx'
import {
  Grid,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { StateContext } from '../state'
import translations from '../i18n'
import Objective from '../shared/Objective'
import useSmallViewport from '../shared/useSmallViewport'
import DebouncedTextField from '../shared/DebouncedTextField'

const useStyles = makeStyles(theme => ({
  objectivesGrid: {
    margin: '0 auto',
  },
  filtering: {
    marginLeft: theme.spacing(1),
  },
  hide: {
    visibility: 'hidden',
  }
}))

function Objectives({
  stageI,
  stageII,
  secrets,
  onFilterChange,
}) {
  const smallViewport = useSmallViewport()
  const classes = useStyles()
  const { objectives: { data: availableObjectives } } = useContext(StateContext)

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const filteredObjectives = useMemo(() => {
    const  withMeta = translations.objectivesArray.map(obj => ({ ...obj, ...availableObjectives[obj.slug]}))

    return [
      ...(stageI ? withMeta.filter(obj => obj.points === 1 && !obj.secret) : []),
      ...(stageII ? withMeta.filter(obj => obj.points === 2 && !obj.secret) : []),
      ...(secrets ? withMeta.filter(obj => obj.secret) : []),
    ].filter(obj =>
      obj.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      obj.condition.toLowerCase().includes(searchValue.toLowerCase()) )
  }, [availableObjectives, searchValue, stageI, stageII, secrets]);

  return <>
    <Grid
      className={classes.objectivesGrid}
      container
      alignItems="center"
      justifyContent={smallViewport ? 'center' : 'flex-start'}
      spacing={2}
    >
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={stageI} onChange={() => onFilterChange(filters => ({ ...filters, stageI: !filters.stageI}))} />}
            label="Stage I"
          />
          <FormControlLabel
            control={<Checkbox checked={stageII} onChange={() => onFilterChange(filters => ({ ...filters, stageII: !filters.stageII}))} />}
            label="Stage II"
          />
          <FormControlLabel
            control={<Checkbox checked={secrets} onChange={() => onFilterChange(filters => ({ ...filters, secrets: !filters.secrets}))} />}
            label="Secret"
          />
        </FormGroup>
      </Grid>
      {filteredObjectives.map(({ slug }) => <Grid item key={slug}><Objective
        small={smallViewport}
        slug={slug}
        highlight={searchValue.split(' ')}
      /></Grid>)}
    </Grid>
  </>
}

export default Objectives
