import { useEffect } from 'react'
import {
  Button,
  Chip,
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
import { useHistory, generatePath } from 'react-router-dom'

import { useTranslation, Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import { useGameVersion, DEFAULT_VERSION } from '../GameComponents'

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
    display: 'flex',
    gap: '1rem',
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
export function SessionsList({ sessions, listId, onDeleteSession }) {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const { setGameVersion } = useGameVersion()

  useEffect(() => {
    setGameVersion(DEFAULT_VERSION)
  }, [setGameVersion])

  return (
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
          const defaultName = session.factions?.length
            ? session.factions
                .map((factionKey) => t(`factions.${factionKey}.name`))
                .join(', ')
            : `Drafting in progress...`

          return (
            <ListItem key={session.id} button className={classes.listItem}>
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
              {session.editable && !session.locked && (
                <ListItemIcon>
                  <Chip
                    color="secondary"
                    icon={<EditOutlined />}
                    label={t('sessionList.edit')}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                onClick={() =>
                  history.push(
                    generatePath(SESSION_VIEW_ROUTES.main, {
                      sessionId: session.id,
                      secret: session.editable ? session.secret : undefined,
                    }),
                  )
                }
                primary={session.displayName || defaultName}
                secondary={`${session.start || ''} ${
                  session.displayName
                    ? t('sessionList.secondaryTitle', {
                        factionList: defaultName,
                      })
                    : ''
                }`}
              />
              <Button
                color="secondary"
                onClick={() => {
                  onDeleteSession({
                    id: session.id,
                    name: session.displayName,
                  })
                }}
              >
                {t('sessionList.delete')}
              </Button>
            </ListItem>
          )
        })}
      </List>
      <em style={{ fontSize: '.85em', float: 'right' }}>
        <Trans i18nKey="sessionList.yourListIdentifier" values={{ listId }} />
      </em>
    </>
  )
}
