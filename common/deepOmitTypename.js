function deepOmitTypename(obj) {
  return JSON.parse(JSON.stringify(obj), omitTypename)
}

function omitTypename(key, value) {
  return key === '__typename' ? undefined : value
}

export default deepOmitTypename
