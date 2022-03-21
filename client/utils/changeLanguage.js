import qs from 'qs'

export function getLanguageChangeUrl(locale) {
  const location = window.location
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const newSearch = qs.stringify({ ...query, set_language: locale }, { addQueryPrefix: true })
  return `${location.pathname}${newSearch}${location.hash}`
}

export default function changeLanguage(locale) {
  window.location.href = getLanguageChangeUrl(locale)
}
