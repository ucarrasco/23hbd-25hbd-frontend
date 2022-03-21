import React, { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import useBreakpoint from 'utils/useBreakpoint'
import { Trans } from 'react-i18next'
import moment from 'moment'
import nl2br from 'utils/nl2br'
import isIn from 'common/fp/isIn'
import cn from 'classnames'
import placeholderImage from 'assets/images/user-placeholder.hbd.jpg'
import * as styles from './index.module.hbd.scss'
import { style } from 'react-toastify'
// import Markdown from 'utils/Markdown'
import Markdown from 'markdown-to-jsx'
import { createPortal } from 'react-dom'
import agatheImg from 'assets/images/23hbd/agathe2.jpeg'
import noumenieImg from 'assets/images/23hbd/noumenie2.jpeg'
import feilynImg from 'assets/images/23hbd/feilyn.jpeg'

const now = moment()

function PortaledH1({ target, children }) {
  return createPortal(
    children,
    target
  )
}

function Home({ currentEdition }) {
  const titleRef = useRef()
  const period = useMemo(
    () => {
      const beginDate = moment(currentEdition.beginDate)
      const endDate = moment(currentEdition.endDate)
      if (now.isBefore(beginDate.clone().subtract(8, 'hours'))) return 'before'
      if (now.isBefore(beginDate)) return 'day-before'
      if (now.isBefore(endDate)) return 'during'
      if (now.isBefore(endDate.clone().add(11, 'hours'))) return 'day-after'
      return 'after'
    },
    [currentEdition]
  )
  return (
    <div className={styles.mainContent}>
      <h1 ref={titleRef} />
      <div className="d-flex flex-column flex-md-row align-items-center">
        <div className="px-3">
          <div className={styles.mascotte} />
        </div>
        <div className={cn("flex-grow-1 py-3 px-sm-4")}>
          {!!titleRef.current && (
            <Markdown
              options={{
                overrides: {
                  h1: { component: PortaledH1, props: { target: titleRef.current }},
                },
              }}
            >
              {t(`flavored:home-page.content`)}
            </Markdown>
          )}
          {period === 'before' && (
            <div className={style.editionDatesInfo}>
              {t(`flavored:home-page.before-content.dates-info`)}
            </div>
          )}
          {period === 'day-before' && (
            <div className={style.editionDatesInfo}>
              {t(`flavored:home-page.day-before-content.dates-info`)}
            </div>
          )}
          {(period |> isIn(['during', 'day-after', 'after'])) && (
            <div className={styles.themeInfo}>
              {
                currentEdition.theme
                  ? nl2br(currentEdition.theme)
                  : t(`flavored:home-page.during-content.theme-incoming`)
              }
            </div>
          )}
          <TwitchBlock currentEdition={currentEdition} />
        </div>
      </div>
      <Featured>
        <Featured.Item
          title="Agathe, marraine 2022"
          imgSrc={agatheImg}
          links={[
            <Featured.Item.Link key={0} style={{ fontSize: "0.9em" }}>{t(`global.interview-coming-soon`)}</Featured.Item.Link>
          ]}
        />
        <Featured.Item
          title="Feilyn, illustratrice 2022"
          imgSrc={feilynImg}
          links={[
            <Featured.Item.Link key={0} style={{ fontSize: "0.9em" }}>{t(`global.interview-coming-soon`)}</Featured.Item.Link>
          ]}
        />
        <Featured.Item
          title="Nouménie, partenaire 2022"
          imgSrc={noumenieImg}
          links={[
            <Featured.Item.Link key={0} style={{ fontSize: "0.9em" }}>{t(`global.interview-coming-soon`)}</Featured.Item.Link>
          ]}
        />
      </Featured>
    </div>
  )
}

function TwitchBlock({ currentEdition }) {
  const isLg = useBreakpoint("lg")
  if (currentEdition && currentEdition.customData && currentEdition.customData.twitch && currentEdition.customData.twitch.active) {
    return (
      isLg
        ? (
          <div className="mt-5">
            <div
              className="d-flex justify-content-center mt-5"
              dangerouslySetInnerHTML={{ __html: currentEdition.customData.twitch.content }}
            />
          </div>
        )
        : (
          <div className="mt-5">
            <Trans i18nKey="flavored:home-page.radio-carotte.simple-link">
              Cette année, suivez les 23hBD avec le stream officiel, <a href={currentEdition.customData.twitch.url}>Radio Carotte</a> !
            </Trans>
          </div>
        )
    )
  }
  return null
}

function Featured({ className, ...props }) {
  return (
    <div className="d-md-flex mt-5 justify-content-around text-center px-3 px-sm-5 px-md-2 px-lg-5" {...props} />
  )
}

Featured.Item = function({
  title,
  imgSrc = placeholderImage,
  links = [],
}) {
  return (
    <div className={styles.featuredItem}>
      <img
        src={imgSrc}
        alt={title}
        className={styles.featuredItemImg}
      />
      <div className="p-2">
        <div className={styles.featuredItemTitle}>
          {title}
        </div>
        {links.map(
          (link, i) => (
            <div key={i}>
              {link}
            </div>
          )
        )}
      </div>
    </div>
  )
}
Featured.Item.displayName = "Featured.Item"

Featured.Item.Link = function(props) {
  if (props.to) {
    return <Link {...props} />
  }
  else if (props.href) {
    return <a {...props} />
  }
  else {
    return <span {...props} />
  }
}


export default Home
