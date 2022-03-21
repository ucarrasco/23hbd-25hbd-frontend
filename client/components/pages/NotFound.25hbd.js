import React from 'react'
import { Link } from 'react-router-dom'
import illu from 'assets/images/notfound_25h.png'

export default () => (
  <React.Fragment>
    <h1 className="mb-5 text-center">Page non trouvée</h1>

    <p className="text-center"><img src={illu} /></p>

    <p className="h2 text-center mb-0">Désolé petite tortue !</p>
    <p className="h3 text-center">Tu t'es trompé de route...</p>
    <p className="text-center"><Link to="/" className="btn btn-secondary text-white">Retour à l'accueil</Link></p>
  </React.Fragment>
)

