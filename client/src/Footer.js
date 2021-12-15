import { useTranslation, Trans } from 'react-i18next'

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
    </footer>
  )
}
