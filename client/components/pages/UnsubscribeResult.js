import React from 'react'
import qs from 'query-string'
import { Link } from 'react-router-dom'

const UnsubscribeSuccess = ({ emailType }) => (
  <div className="text-center py-5">
    Compris ! Tu ne recevras plus d'emails de notifications
    {
      emailType === 'commentsNotifications'
        ? ` lors de nouveaux commentaires !`
        : undefined
    }
    <div className="mt-5">
      <Link to="/" className="btn btn-hbd" replace>Retour à l'accueil</Link>
    </div>
  </div>
)

const UnsubscribeError = () => (
  <div className="text-center py-5">
    <div>Aïe aïe aïe ! Il y a eu une erreur au désabonnement (promis ce n'est pas une ruse pour continuer à t'envoyer des emails !).</div>
    <div>Si le problème persiste, <Link to="/contact/">contacte-nous</Link>.</div>
    <div className="mt-5">
      <Link to="/" className="btn btn-hbd" replace>Retour à l'accueil</Link>
    </div>
  </div>
)

const UnsubscribeResult = ({ success, emailType }) => (
  success
    ? <UnsubscribeSuccess emailType={emailType} />
    : <UnsubscribeError />
)

export default UnsubscribeResult

export const Routed = ({ match, location }) => (
  // <pre>{JSON.stringify({ match, location }, null, 2)}</pre>
  <UnsubscribeResult
    success={match.path == "/unsubscribe-success/"}
    emailType={qs.parse(location.search).email_type}
  />
)
