import React from 'react'
import withQueryResult from 'utils/withQueryResult'
import gql from 'graphql-tag'
import BlogPost from './BlogPost'
import { Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import groupBy from 'lodash/fp/groupBy'
import moment from 'moment'

const Blog = ({ blogPosts }) => {
  const orderedBlogPosts = [...blogPosts.values()].sort(
    (post1, post2) => moment(post2.publishedAt).unix() - moment(post1.publishedAt).unix()
  )
  return (
    <Row>
      <Col md={9}>
        {
          orderedBlogPosts.slice(0, 5).map(
            blogPost =>
              <BlogPost key={blogPost.id} blogPost={blogPost} />
          )
        }
      </Col>

      <Col md={3}>
        <TableOfContents orderedBlogPosts={orderedBlogPosts} />
      </Col>
    </Row>
  )
}

function TableOfContents({ orderedBlogPosts }) {
  const groupedByYears = (orderedBlogPosts |> groupBy(post => moment(post.publishedAt).year()) |> Object.entries).sort((group1, group2) => group2[0] - group1[0])
  return (
    <div style={{ backgroundColor: "#e1e1e1", padding: 5 }}>
      <h2 className="text-center blog-h2 my-3">
        {t(`blog-page.posts-summary.title`)}
      </h2>
      {
        groupedByYears.map(
          ([year, posts], i) => {
            return (
              <React.Fragment key={year}>
                { !!i && (
                  <div className="text-center mb-1">
                    {year}
                  </div>
                )}
                <ul style={{ paddingLeft: "2em", fontSize: "0.75rem" }}>
                  {
                    posts.map(
                      ({ id, title, slug }) =>
                        <li key={id}>
                          <Link to={`/blog/${slug}/`}>
                            { title }
                          </Link>
                        </li>
                    )
                  }
                </ul>
              </React.Fragment>
            )
          }
        )
      }
    </div>
  )
}

const withBlogPosts = withQueryResult(
  gql`
    query BlogPosts {
      blogPosts {
        id
        slug
        title
        htmlContent
        publishedAt
      }
    }
  `
)

export default withBlogPosts(Blog)
