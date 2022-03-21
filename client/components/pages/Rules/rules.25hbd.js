import React, { useMemo } from 'react'
import Markdown from 'markdown-to-jsx'
import rulesMdContent from 'raw-loader!./rules.hbd.md'
import getSlug from 'speakingurl'
import { gridBreakpoints } from 'config/sassVariables'
import Achievement from 'components/Achievement'

export default function Rules() {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { props: { className: "mb-5" }},
          h2: { props: { className: "mt-4 mb-3" }},
          TableOfContents: { component: TableOfContents },
          blockquote: { props: { className: "mt-5 text-muted-light", style: { fontSize: "0.9em", lineHeight: "1.1em", fontStyle: "italic" }}},
          Achievement: Achievement,
        },
        slugify: getSlug,
      }}
      css={`
        font-family: Manjari;
        font-size: 17px;
        h1, h2 {
          font-family: var(--body-font-family);
        }
        p {
          text-align: justify;
        }
      `}
    >
      {rulesMdContent}
    </Markdown>
  )
}

function TableOfContents() {
  const chapters = useMemo(
    () => (
      rulesMdContent
        .split("\n").filter(line => line.match(/^## (.+)/))
        .map(line => line.match(/^## (.+)/)[1])
    ),
    []
  )
  return (
    <div
      css={`
        padding: 5px;
        background-color: #e1e1e1;
        margin-bottom: 20px;
        @media (min-width: ${gridBreakpoints.lg}px) {
          max-width: 300px;
          margin-bottom: 0;
        }
        font-family: var(--body-font-family);
      `}
      className="float-lg-right ml-lg-4"
    >
      <h3 className="text-center blog-h2 my-3">
        Sommaire
      </h3>
      <ul style={{ paddingLeft: "2em", fontSize: "0.75rem" }}>
        {
          chapters.map(
            (title) =>
              <li key={title}>
                <a href={`#${getSlug(title)}`}>
                  { title }
                </a>
              </li>
          )
        }
      </ul>
    </div>
  )
}