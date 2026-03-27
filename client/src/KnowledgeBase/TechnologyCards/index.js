import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useSmallViewport from '../../shared/useSmallViewport'

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

function TechnologyCards() {
  const classes = useStyles()
  const smallViewport = useSmallViewport()

  return (
    <Grid
      className={classes.grid}
      container
      direction="column"
      justifyContent={smallViewport ? 'center' : 'flex-start'}
    >
      <p>
        we are working on a proper filterable tech tree, for now check out tech
        tree below
      </p>
      <p>(click for bigger image)</p>
      <a
        href="https://preview.redd.it/tech-tree-for-thunders-edge-v0-aylybg2k024g1.png?width=5146&format=png&auto=webp&s=2593d71e5e750435ef1e972a58d73832e74ec0d1"
        rel="nofollow"
        target="about:blank"
        title="click to open in new card"
      >
        <img
          alt="tech tree"
          src="https://preview.redd.it/tech-tree-for-thunders-edge-v0-aylybg2k024g1.png?width=5146&format=png&auto=webp&s=2593d71e5e750435ef1e972a58d73832e74ec0d1"
          style={{ width: '100%' }}
        />
      </a>
    </Grid>
  )
}

export default TechnologyCards
