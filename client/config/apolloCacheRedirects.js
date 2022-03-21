// awesome feature, explained here: https://www.apollographql.com/docs/react/advanced/caching.html#cacheRedirect

export default {
  Query: {
    edition: (_, args, { getCacheKey }) => {
      if (args.id)
        return getCacheKey({ __typename: 'Edition', id: args.id })
    }
  },
}
