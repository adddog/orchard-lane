import { first } from "lodash"
import { getActivePlaylistVideoId } from "selectors/videoModel"

export const getActiveWallData = state => {
  const videoId = getActivePlaylistVideoId(state)
  return first(state.mapData
    .get("wallData")
    .filter(pathObj => pathObj.videoId === videoId))
}
