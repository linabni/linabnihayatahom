import queryString from 'query-string'

const getFromQueryString = (key: string) => {
  return queryString.parse(window.location.search)[key]
}

export default getFromQueryString
