import React from 'react'
import './blog-post.sass'
import moment from 'moment'
import gql from 'graphql-tag'
import withQueryResult from 'utils/withQueryResult'

const BlogPost = ({ blogPost: { id, title, htmlContent, publishedAt }}) =>
  <article className="blog-post">
    <h2 className="blog-h2 mt-2">{title}</h2>
    <div className="published-at mb-4">{moment(publishedAt).format("LL")}</div>
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  </article>


export const StandAlone = withQueryResult(
  gql`
    query BlogPost($slug: String!) {
      blogPost(slug: $slug) {
        id
        slug
        title
        htmlContent
        publishedAt
      }
    }
  `,
  {
    variables: ({ slug }) => ({ slug })
  }
)(BlogPost)

export default BlogPost
