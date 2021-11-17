import {
  Chip,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add, EditOutlined } from '@material-ui/icons'
import { Link, useHistory, generatePath } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'

import { SESSION_VIEW_ROUTES } from './shared/constants'

const useStyles = makeStyles((theme) => ({
  list: {
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
    },EditOutlined
    float: 'right',
    right: 0,
    bottom: 10,
    marginTop: 10,
    zIndex: 1199,
  },
  listItem: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
}))

function SessionsList({ loading, sessions }) {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <List
        className={classes.list}
        subheader={
          <ListSubheader>
            <Trans i18nKey="sessionList.title" />
          </ListSubheader>
        }
      >
        {sessions.map((session) => {
          const factionList = session.factions
            .map((factionKey) => t(`factions.${factionKey}.name`))
            .join(', ')

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
              <ListItemText
                primary={session.displayName || factionList}
                secondary={`${session.start || ''} ${
                  session.displayName
                    ? t('sessionList.secondaryTitle', { factionList })
                    : ''
                }`}
              />
              {session.editable && (
                <ListItemIcon>
                  <Chip
                    color="secondary"
                    icon={<EditOutlined />}
                    label={t('sessionList.fullAccess')}
                  />
                </ListItemIcon>
              )}
            </ListItem>
          )
        })}
      </List>
      <Link to="/new">
        <Fab
          aria-label={t('sessionList.new')}
          className={classes.fab}
          color="primary"
          title={t('sessionList.new')}
        >
          <Add />
        </Fab>
      </Link>
    </>
  )
}

export default SessionsList
