import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import symbols from '../../assets/tech-symbols.png'
import dependencies from '../../assets/tech-dependencies.png'

const getDependencyPosition = (techType, level) => {
  const singleDepPercentage = 100 / 12

  const typeStarts = [
    singleDepPercentage * 6 + 5,
    1,
    singleDepPercentage * 3 + 3,
    singleDepPercentage * 9 + 7,
  ]

  return {
    backgroundPosition: `${
      typeStarts[techType] + (level - 1) * singleDepPercentage
    }%`,
  }
}

const TechnologyTypeEnum = {
  0: 'biotic',
  1: 'propulsion',
  2: 'cybernetic',
  3: 'warfare',
}

const DependenciesClasses = {
  [TechnologyTypeEnum[0]]: {
    1: 'biotic1',
    2: 'biotic2',
    3: 'biotic3',
  },
  [TechnologyTypeEnum[1]]: {
    1: 'propulsion1',
    2: 'propulsion2',
    3: 'propulsion3',
  },
  [TechnologyTypeEnum[2]]: {
    1: 'cybernetic1',
    2: 'cybernetic2',
    3: 'cybernetic3',
  },
  [TechnologyTypeEnum[3]]: {
    1: 'warfare1',
    2: 'warfare2',
    3: 'warfare3',
  },
}

const useStyles = makeStyles({
  typeRoot: {
    backgroundImage: `url(${symbols})`,
    backgroundSize: 'auto 100%',
  },
  [TechnologyTypeEnum[0]]: {
    backgroundPosition: '33%',
  },
  [TechnologyTypeEnum[2]]: {
    backgroundPosition: '100%',
  },
  [TechnologyTypeEnum[3]]: {
    backgroundPosition: '66%',
  },
  levelRoot: {
    backgroundImage: `url(${dependencies})`,
    backgroundSize: 'auto 100%',
  },
  [DependenciesClasses[TechnologyTypeEnum[0]][1]]: getDependencyPosition(0, 1),
  [DependenciesClasses[TechnologyTypeEnum[0]][2]]: getDependencyPosition(0, 2),
  [DependenciesClasses[TechnologyTypeEnum[0]][3]]: getDependencyPosition(0, 3),
  [DependenciesClasses[TechnologyTypeEnum[1]][1]]: getDependencyPosition(1, 1),
  [DependenciesClasses[TechnologyTypeEnum[1]][2]]: getDependencyPosition(1, 2),
  [DependenciesClasses[TechnologyTypeEnum[1]][3]]: getDependencyPosition(1, 3),
  [DependenciesClasses[TechnologyTypeEnum[2]][1]]: getDependencyPosition(2, 1),
  [DependenciesClasses[TechnologyTypeEnum[2]][2]]: getDependencyPosition(2, 2),
  [DependenciesClasses[TechnologyTypeEnum[2]][3]]: getDependencyPosition(2, 3),
  [DependenciesClasses[TechnologyTypeEnum[3]][1]]: getDependencyPosition(3, 1),
  [DependenciesClasses[TechnologyTypeEnum[3]][2]]: getDependencyPosition(3, 2),
  [DependenciesClasses[TechnologyTypeEnum[3]][3]]: getDependencyPosition(3, 3),
})

export function TechType({ type, className }) {
  const classes = useStyles()

  return (
    <div
      className={clsx(
        className,
        classes.typeRoot,
        classes[TechnologyTypeEnum[type]],
      )}
    />
  )
}

export function TechLevel({ type, level, className }) {
  const classes = useStyles()

  if (level === 0) {
    return null
  }

  return (
    <div
      className={clsx(
        className,
        classes.levelRoot,
        classes[DependenciesClasses[TechnologyTypeEnum[type]][level]],
      )}
    />
  )
}
