import queryString from "query-string"

const qs = (key: string) => {
  return queryString.parse(window.location.search)[key]
}

export default qs
