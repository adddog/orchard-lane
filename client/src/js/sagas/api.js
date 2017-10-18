import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)

export const JsonApiRequest = (url, options = {}) => {
  return xhr(url, { json: true, ...options })
}
