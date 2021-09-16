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
// TODO make it shared component
import Objective from '../SessionView/PublicObjectives/Objective'
import useSmallViewport from '../useSmallViewport'

import DebouncedTextField from './DebouncedTextField'

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

function Objectives() {
  const smallViewport = useSmallViewport()
  const classes = useStyles()
  const { objectives: { data: availableObjectives } } = useContext(StateContext)

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const [stageISelected, setStageI] = useState(true)
  const [stageIISelected, setStageII] = useState(true)
  const [secretSelected, setSecret] = useState(true)

  const filteredObjectives = useMemo(() => {
    const  withMeta = translations.objectivesArray.map(obj => ({ ...obj, ...availableObjectives[obj.slug]}))

    return [
      ...(stageISelected ? withMeta.filter(obj => obj.points === 1 && !obj.secret) : []),
      ...(stageIISelected ? withMeta.filter(obj => obj.points === 2 && !obj.secret) : []),
      ...(secretSelected ? withMeta.filter(obj => obj.secret) : []),
    ].filter(obj =>
      obj.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      obj.condition.toLowerCase().includes(searchValue.toLowerCase()) )
  }, [availableObjectives, stageISelected, stageIISelected, secretSelected, searchValue]);

  return <>
    <Grid
      className={classes.objectivesGrid}
      container
      alignItems="center"
      justifyContent={smallViewport ? 'center' : ''}
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
            control={<Checkbox checked={stageISelected} onChange={() => setStageI(x => !x)} />}
            label="Stage I"
          />
          <FormControlLabel
            control={<Checkbox checked={stageIISelected} onChange={() => setStageII(x => !x)} />}
            label="Stage II"
          />
          <FormControlLabel
            control={<Checkbox checked={secretSelected} onChange={() => setSecret(x => !x)} />}
            label="Secret"
          />
        </FormGroup>
      </Grid>
      {filteredObjectives.map(({ slug }) => <Grid item key={slug}><Objective
        small={smallViewport}
        slug={slug}
      /></Grid>)}
    </Grid>
  </>
}

export default Objectives
