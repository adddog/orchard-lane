import { Map } from "immutable"
import {
  INIT_LOAD_COMPLETE,
} from "actions/actionTypes"
const initialState = new Map({
  loadComplete: false,
})

export default function general(state = initialState, action) {
  switch (action.type) {
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
