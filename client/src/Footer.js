import { useTranslation, Trans } from './i18n'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer>
      © Tarnaspol Mateusz Tarnaski -{' '}
      <a href="https://paxmagnifica.com">Pax Magnifica Bellum Gloriosum.</a> |{' '}
      <Trans i18nKey="support.theCreator" /> -{' '}
      <a href={t('support.buymeacoffee')} rel="nofollow">
        <Trans i18nKey="support.donate" />
      </a>
      <br />
      <a
        href="https://github.com/paxmagnifica/ti4-companion/blob/development/RELEASE_NOTES.md"
        rel="nofollow"
      >
        <Trans i18nKey="general.releaseNotes" />
      </a>
    </footer>
  )
}
