import {
  Button,
  Chip,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  EditOutlined,
  Lock,
  Done,
  Autorenew as InProgress,
} from '@material-ui/icons'
import { Link, useHistory, generatePath } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'

import { SESSION_VIEW_ROUTES } from './shared/constants'

const useStyles = makeStyles((theme) => ({
  list: {
    marginTop: theme.spacing(5),
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2%',
    '& .MuiListItem-root:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    '& .MuiListSubheader-root': {
      background: 'none',
      color: 'white',
    },
    '& .MuiTypography-root': {
      color: 'white',
    },
  },
  listItem: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  cta: {
    textDecoration: 'none',
  },
}))

// TODO handle drafts
function SessionsList({ loading, sessions }) {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container justifyContent="space-around" spacing={4}>
        <Grid item sm={4} xs={12}>
          <Link className={classes.cta} to="/new/factions">
            <Button color="primary" fullWidth variant="contained">
              <Trans i18nKey="sessionList.cta.set" />
            </Button>
          </Link>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Link className={classes.cta} to="/new/draft">
            <Button color="secondary" fullWidth variant="contained">
              <Trans i18nKey="sessionList.cta.draft" />
            </Button>
          </Link>
        </Grid>
      </Grid>
      <List
        className={classes.list}
        subheader={
          <ListSubheader>
            <Trans i18nKey="sessionList.title" />
          </ListSubheader>
        }
      >
        {sessions.map((session) => {
          const defaultName = session.factions?.length
            ? session.factions
                .map((factionKey) => t(`factions.${factionKey}.name`))
                .join(', ')
            : `Drafting in progress...`

          return (
            <ListItem
              key={session.id}
              button
              className={classes.listItem}
              onClick={() =>
                history.push(
                  generatePath(SESSION_VIEW_ROUTES.main, {
                    sessionId: session.id,
                    secret: session.editable ? session.secret : undefined,
                  }),
                )
              }
            >
              <ListItemIcon>
                {session.finished ? (
                  <Tooltip placement="top" title={t('sessionList.done')}>
                    <Done color="secondary" />
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title={t('sessionList.inProgress')}>
                    <InProgress />
                  </Tooltip>
                )}
                {session.editable && session.locked && (
                  <Tooltip placement="top" title={t('sessionList.locked')}>
                    <Lock />
                  </Tooltip>
                )}
              </ListItemIcon>
              <ListItemText
                primary={session.displayName || defaultName}
                secondary={`${session.start || ''} ${
                  session.displayName
                    ? t('sessionList.secondaryTitle', { defaultName })
                    : ''
                }`}
              />
              {session.editable && !session.locked && (
                <ListItemIcon>
                  <Chip
                    color="secondary"
                    icon={<EditOutlined />}
                    label={t('sessionList.edit')}
                  />
                </ListItemIcon>
              )}
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default SessionsList
