import React, { useMemo } from 'react'
import {
  Row,
  Col
} from 'reactstrap'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Markdown from 'utils/Markdown'
import moment from 'moment'
import userPlaceHolderImage from 'assets/images/user-placeholder.hbd.jpg'
import spaceTurtle from 'assets/images/25hbd/25h2021 profile picture.jpg'
import pocchimaImg from 'assets/images/25hbd/pocchima.jpg'
import calyImg from 'assets/images/25hbd/caly.jpg'
import natureOccitanieImg from 'assets/images/25hbd/nature-occitanie.png'
import afficheThumbImg from 'assets/images/25hbd/affiche-25hbd-2021-thumb.png'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import nl2br from 'utils/nl2br'

const Home = ({ currentEdition }) => {
  const now = useMemo(() => moment(), [])
  const theme = useQuery(
    gql`
      query Theme {
        currentEdition {
          id
          theme
        }
      }
    `,
    { fetchPolicy: 'cache-only' }
  ).data.currentEdition.theme
  return pug`
    .home-page.d-md-flex(style={ margin: "-1.5rem", marginBottom: "calc(-1.5rem - 4px)" })
      aside.my-5.text-center.border-right-sm-0.px-4.d-none.d-lg-block
        img.space-turtle(src=spaceTurtle alt="Tortue de l'espace")
        .mt-5
        Vip(src=natureOccitanieImg links=[{ label: "Lire l'interview", to: "/blog/806034_nature-en-occitanie-partenaire-des-25hbd-2021/" }]) notre partenaire 2021
      .flex-grow-1
        .home-page-main-block
          h1.text-primary.mb-4
            | 25 Heures de la BD et de l'Illustration
          Markdown= INTRO_TEXT_MD
          if now.isAfter(moment(currentEdition.beginDate))
            .lead.p-3.text-center= nl2br(theme || "Thème à venir")
          else
            .lead.lead-space-turtle.p-3.text-center
              p.mb-1 La septième édition des 25HBD aura lieu les #[strong 30 et 31 octobre] 2021 de #[strong 13h00 à 13h00] (heure française).
              p.m-0(style={ fontSize: "0.9em" })
                | Inscriptions #[Link(to="/register") ici →]
          .mt-5
            .d-flex.align-items-center
              a.mr-3(href="https://ddxgoij8mmg1v.cloudfront.net/content/affiche-25hbd-2021.png" target="blank")
                img(src=afficheThumbImg alt="Affiche 2021" style={ width: 120, boxShadow: "3px 3px 3px #0000003d" })
              .flex-grow-1
                | L'illustration de cette année est le fruit de la collaboration de deux vétéranes du marathon, #[Link(to="/participants/2020/poc/") Poc] et #[Link(to="/participants/2020/ecchima/") Ecchima], qui nous livrent une affiche délicieusement spatiale !
      aside.my-md-5.text-center.border-left-sm-0.px-4.d-flex.d-md-block.justify-content-around.pb-5.pb-md-0
        Vip(src=pocchimaImg links=[{ label: "Lire l'interview", to: "/blog/697317_interview-de-poc-et-ecchima-duo-d-illustration-2021/" }] imgStyle={ transform: "rotate(2deg)", borderRadius: 10, filter: "contrast(1.1) brightness(1.1)" }) Poc & Ecchima, illustratrices 2021
        Vip(src=calyImg links=[{ label: "Lire l'interview", to: "/blog/234516_caly-marraine-de-l-edition-2021/" }] imgStyle={ filter: "contrast(0.9)", transform: "rotate(-2deg)", borderRadius: 19 }) Caly, marraine 2021
        Vip.d-lg-none(src=natureOccitanieImg links=[{ label: "Lire l'interview", to: "/blog/806034_nature-en-occitanie-partenaire-des-25hbd-2021/" }]) Nature En Occitanie, partenaire 2021
  `
}

const INTRO_TEXT_MD = `
Les 25 Heures de la BD et de l'Illustration sont un marathon artistique qui se déroule en ligne.

Il faut créer une bande dessinée de 12 pages ou une série de 12 illustrations ou un webtoon de 24 panels, avec un thème et une contrainte imposés, dans un délai de 25 heures.

Tout le monde peut participer, quel que soit son niveau ou son âge.

Pas de jury, mais un compteur. Les plus rapides décrochent une tortue d'or, les retardataires une tortue d'argent et les frimeuses une tortue rouge.

Pour plus de détails sur le déroulement de l'événement, consulte le règlement.
`

function Vip({ src, to, href, children, links, placeholder, imgStyle, className }) {
  return pug`
    .vip(className=className)
      AnyLink(to=to)
        .vip-thumbnail
          img(src=(src || userPlaceHolderImage) alt=children style=imgStyle)
      .mt-2
        div
          AnyLink.link-unstyled(to=to href=href)
            span.vip-name= children
        each link, index in links
          AnyLink(key=index to=link.to href=link.href target="blank")= link.label
  `
}

function AnyLink(props) {
  let ComponentToUse = "span"
  if (typeof props.href === 'string') {
    ComponentToUse = "a"
  }
  if (typeof props.to === 'string') {
    ComponentToUse = Link
  }
  return <ComponentToUse {...props} />
}


export default Home
