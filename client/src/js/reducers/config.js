import QS from "query-string"
import { Map } from "immutable"
const parsed = QS.parse(window.location.search)
const initialState = new Map({
  hideVideo: !!parsed.hideVideo,
  showDevMap: !!parsed.debug,
  debug: !!parsed.debug,
})

export default function config(state = initialState, action) {
  switch (action.type) {
    default: {
      return state
    }
  }
}
