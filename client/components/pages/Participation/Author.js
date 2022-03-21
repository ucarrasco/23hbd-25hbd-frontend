import React, { useContext } from 'react'
import profilePicPlaceHolder from 'assets/images/user-placeholder.hbd.jpg'
import moment from 'moment'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import ScrollToTopOnMount from 'utils/ScrollToTopOnMount'
import { Link } from 'react-router-dom'
import ParticipationContext from './ParticipationContext'
import styled from 'styled-components'
import FollowStatus from './FollowStatus'
import useMe from 'utils/useMe'
import { features } from 'common/flavorConfig.hbd'

const Author = ({ user }) => {
  const logged = !!useMe()
  const { participation: participationBeingViewed } = useContext(ParticipationContext)
  const hasAtLeastOneAchievement = user.participations.some(
    (participation) => participation.achievement
  )

  return (
    <AuthorContainer>
      <ScrollToTopOnMount />
      <img
        src={user.avatarUrl || profilePicPlaceHolder}
        alt={t(`participation-page.author.img-alt`, { username: user.username })}
        className="block"
        style={{ width: 135, border: "2 px solid #bbb" }}
      />

      <div
        className="my-3 text-center d-flex align-items-center"
        style={{
          fontWeight: "bold",
          fontSize: "1.4em"
        }}
      >
        <div>
          { user.username }
        </div>
        {
          (logged && features.followAuthors) && (
            <FollowStatus
              userId={user.id}
              className="ml-2"
            />
          )
        }
      </div>

      {
        user.webcamUrl && (
          <a
            href={user.webcamUrl}
            className="btn btn-hbd btn-sm mb-3 px-4"
          >
            {t(`participation-page.author.webcam`)}
          </a>
        )
      }

      <div>
        <span>{t(`participation-page.author.age.title`)}</span>
        {" "}
        { moment().diff(moment(user.birthDate), 'years') }
      </div>

      {
        user.country && (
          <div>
            <span>{t(`participation-page.author.country.title`)}</span>
            {" "}
            { user.country }
          </div>
        )
      }

      {
        user.description && (
          <div>
            <span>{t(`participation-page.author.description.title`)}</span>
            {" "}
            { user.description }
          </div>
        )
      }

      {
        (user.participations.filter(p => !participationBeingViewed || p.id !== participationBeingViewed.id ).length > 0) && (
          <React.Fragment>
            <hr key="separator" className="my-4 w-100" />
            <div key="links" className="align-self-stretch mx-3">
              <div className="text-center mb-3" style={{ fontWeight: "bold" }}>
                {t(`participation-page.author.participations.title`)}
              </div>
              <ul className="list-unstyled">
                {user.participations.map(
                  (participation, i) => {
                    const linkWrapMaybe = (
                      (participationBeingViewed && participationBeingViewed.id === participation.id)
                        ? content => content
                        : (
                          content => (
                            <Link to={`/participants/${participation.edition.year}/${user.slug}`} className="link-alt">
                              {content}
                            </Link>
                          )
                        )
                    )
                    return (
                      <li key={i}>
                        {
                          linkWrapMaybe(
                            <>
                              {
                                hasAtLeastOneAchievement && (
                                <span className={`achievement-text-${participation.achievement || 'none' }`}>
                                  •
                                  {" "}
                                </span>
                              )}
                              {t(`participation-page.author.other-participations.edition-x`, { year: participation.edition.year })}
                            </>
                          )
                        }
                      </li>
                    )
                  }
                  )}
              </ul>
            </div>
          </React.Fragment>
        )
      }

      {
        user.links.length
          ? (
            <React.Fragment>
              <hr key="separator" className="my-4 w-100" />
              <div key="links" className="align-self-stretch mx-3">
                <div className="text-center mb-3" style={{ fontWeight: "bold" }}>
                  {t(`participation-page.author.links.title`)}
                </div>
                <ul className="list-unstyled">
                  {user.links.map(({ title, url }, i) => <li key={i}><a href={url} className="link-alt" target="blank">{title}</a></li>)}
                </ul>
              </div>
            </React.Fragment>
          )
          : undefined
      }
    </AuthorContainer>
  )
}

const AuthorContainer = styled.section.attrs(props => ({ className: "d-flex flex-column align-items-center py-sm-3" }))`
  word-break: break-word;
  > * {
    max-width: 100%;
  }
  span {
    font-weight: bold;
  }

  .btn.btn-hbd {
    color: #eee;
    border: none;
    &:hover {
      background-color: #689890;
    }
    transition: background-color 0s;
  }
`

const withUserInfo = withQueryResult(
  gql`
    query UserInfo($userId: ID!) {
      user(id: $userId) {
        id
        username
        slug
        avatarUrl
        webcamUrl
        birthDate
        country
        description
        links {
          id
          title
          url
        }
        participations(nonEmpty: true) {
          id
          edition {
            id
            year
          }
          achievement
        }
      }
    }
  `,
  {
    variables: ({ userId }) => ({ userId })
  }
)

export default withUserInfo(Author)
