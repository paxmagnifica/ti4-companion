import { useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Grid,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Objective from '../shared/Objective'
import useSmallViewport from '../shared/useSmallViewport'
import DebouncedTextField from '../shared/DebouncedTextField'
import { useTranslation } from '../i18n'

const useStyles = makeStyles((theme) => ({
  objectivesGrid: {
    margin: '0 auto',
  },
  filtering: {
    marginLeft: theme.spacing(1),
  },
  hide: {
    visibility: 'hidden',
  },
}))

function Objectives({
  stageI,
  stageII,
  secrets,
  onFilterChange,
  availableObjectives,
}) {
  const smallViewport = useSmallViewport()
  const classes = useStyles()
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = useState('')
  const [filtering, setFiltering] = useState(false)

  const filteredObjectives = useMemo(() => {
    if (!availableObjectives) {
      return []
    }

    const withMeta = Object.values(availableObjectives).map(
      (availableObjective) => ({
        ...availableObjective,
        name: t(`objectives.${availableObjective.slug}.name`),
        condition: t(`objectives.${availableObjective.slug}.condition`),
      }),
    )

    return [
      ...(stageI
        ? withMeta.filter((obj) => obj.points === 1 && !obj.secret)
        : []),
      ...(stageII
        ? withMeta.filter((obj) => obj.points === 2 && !obj.secret)
        : []),
      ...(secrets ? withMeta.filter((obj) => obj.secret) : []),
    ].filter(
      (obj) =>
        obj.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        obj.condition.toLowerCase().includes(searchValue.toLowerCase()),
    )
  }, [t, availableObjectives, searchValue, stageI, stageII, secrets])

  return (
    <>
      <Grid
        alignItems="center"
        className={classes.objectivesGrid}
        container
        justifyContent={smallViewport ? 'center' : 'flex-start'}
        spacing={2}
      >
        <Grid item sm={6} xs={12}>
          <Grid alignItems="center" container justifyContent="center">
            <DebouncedTextField
              onChange={setSearchValue}
              setLoading={setFiltering}
            />
            <CircularProgress
              className={clsx(classes.filtering, {
                [classes.hide]: !filtering,
              })}
              color="secondary"
              size={18}
            />
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stageI}
                  onChange={() =>
                    onFilterChange((filters) => ({
                      ...filters,
                      stageI: !filters.stageI,
                    }))
                  }
                />
              }
              label={t('general.labels.stageI')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={stageII}
                  onChange={() =>
                    onFilterChange((filters) => ({
                      ...filters,
                      stageII: !filters.stageII,
                    }))
                  }
                />
              }
              label={t('general.labels.stageII')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={secrets}
                  onChange={() =>
                    onFilterChange((filters) => ({
                      ...filters,
                      secrets: !filters.secrets,
                    }))
                  }
                />
              }
              label={t('general.labels.secretObj')}
            />
          </FormGroup>
        </Grid>
        {filteredObjectives.map(({ slug }) => (
          <Grid key={slug} item>
            <Objective
              highlight={searchValue.split(' ')}
              size={smallViewport ? 'small' : 'default'}
              slug={slug}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Objectives
