import { Map } from "immutable"
import {
  THREE_JSON_FONT_SUCCESS,
  INIT_LOAD_COMPLETE,
} from "actions/actionTypes"
const initialState = new Map({
  hotspotFontJSON: {},
  loadComplete: false,
})

export default function general(state = initialState, action) {
  switch (action.type) {
    case THREE_JSON_FONT_SUCCESS: {
      return state.set('hotspotFontJSON', action.payload)
    }
    case INIT_LOAD_COMPLETE: {
      return state.set(
        "loadComplete",
        true
      )
    }
    default: {
      return state
    }
  }
}
