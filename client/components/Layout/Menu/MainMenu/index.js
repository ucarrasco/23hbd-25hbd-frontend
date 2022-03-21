import React, { useMemo } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import HomeItem from './HomeItem.hbd'
import ResponsiveMenu, { Item } from './ResponsiveMenu'
import { features } from 'common/flavorConfig.hbd'
import useRouter from 'utils/useRouter'
import qs from 'query-string'
import useBreakpoint from 'utils/useBreakpoint'
import moment from 'moment'

const MainMenu = () => {
  const { location: { pathname, search }} = useRouter()
  const isSm = useBreakpoint("sm")
  const now = useMemo(() => moment(), [])
  const { data: { currentEdition }} = useQuery(
    gql`
      query CurrentEditionYear { currentEdition { id year beginDate }}
    `,
    { fetchPolicy: 'cache-only' }
  )
  const { data: { fanartsPage } } = useQuery(
    gql`
      query FanartsPageId($editionId: ID!) {
        fanartsPage(editionId: $editionId) {
          id
        }
      }
    `,
    {
      variables: { editionId: currentEdition.id },
      fetchPolicy: 'cache-only',
    }
  )

  const currentEditionHasStarted = now.isAfter(currentEdition.beginDate)
  const yearForList = currentEdition.year
  const yearForGallery = (
    currentEditionHasStarted
      ? currentEdition.year
      : currentEdition.year - 1
  )

  const galleryMode = qs.parse(search).view_mode === 'gallery'
  const isParticipationsPage = pathname.match(/^\/participants\/([0-9]{4}\/)?/)
  return (
    <ResponsiveMenu>
      <Item route="/">
        <HomeItem>
          {t(`layout.main-menu.home`, `Accueil`)}
        </HomeItem>
      </Item>
      {
        !isSm && (
          <Item route="/connexion/" className="d-sm-none">
            {t(`layout.main-menu.sign-in`, `Connexion`)}
          </Item>
        )
      }
      <Item route="/rules/" active={pathname === '/rules/'}>
        {t(`layout.main-menu.rules`, `Règlement`)}
      </Item>
      <Item route={`/participants/${yearForList}/`} active={isParticipationsPage && !galleryMode}>
        {t(`layout.main-menu.participants`, 'Participants')}
      </Item>
      <Item route={`/participants/${yearForGallery}/?view_mode=gallery`} active={isParticipationsPage && galleryMode}>
        {t(`layout.main-menu.gallery`, `Lire les BDs`)}
      </Item>
      <Item route="/blog/" active={!!pathname.match(/^\/blog\//)}>
        {t(`layout.main-menu.blog`, `Blog`)}
      </Item>
      {
        !!fanartsPage && (
          <Item route="/fanarts/">
            {t(`layout.main-menu.fanarts`, `Fanarts`)}
          </Item>
        )
      }
      {/* <Item route="/goodies">Goodies</Item> */}
      <Item route="/random-participation/">
        {t(`layout.main-menu.random-comic`, `Random`)}
      </Item>
    </ResponsiveMenu>
  )
}

export default MainMenu
