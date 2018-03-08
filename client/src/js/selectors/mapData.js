import { last } from "lodash"
import { vec2 } from "gl-matrix"
import math from "usfl/math"
import { getActivePlaylistVideoId } from "selectors/videoModel"
import { getActiveWallData } from "selectors/threeModel"


const MAP_OFFSET_X = 10
const MAP_OFFSET_Y = 10


export const getActivePlaybackMapData = state => {
  const activePlaylistVideoId = getActivePlaylistVideoId(state)
  return !!activePlaylistVideoId
    ? state.mapData.get("raw")[activePlaylistVideoId]
    : null
}

/*************

*************/
export const getTotalPlotProgress = (state, currentTime) => {
  const activeMapData = getActivePlaybackMapData(state)
  const activeWallData = getActiveWallData(state)
  if (!activeMapData || !activeWallData) return null
  const { points } = activeMapData

  let _i = 0
  for (_i; _i < points.length; _i++) {
    const { time } = points[_i]
    if (currentTime >= time) {
      break
    }
  }
  const cuepoint = points[_i]
  const nextCuepoint = points[_i + 1] || {}
  const nextCuepointTime = nextCuepoint.time || last(points).time

  const progress =
    (currentTime - cuepoint.time) / (nextCuepointTime - cuepoint.time)

  const lerpedVal = math.lerp(
    cuepoint.val,
    nextCuepoint.val,
    progress
  )

  return lerpedVal

  console.log(points)
  for (var i = 0; i < points.length; i++) {
    const { val, time } = points[i]
    console.log(points[i])
    console.log(time, currentTime)
    if (currentTime > time) {
      return activeWallData.points[
        Math.floor(val * activeWallData.points.length)
      ]
    }
    return
  }
  return null
}

export const getPlotterPointByProgress = (
  state,
  totalPlotProgress,
  activeWallData
) => {

  const wallData = activeWallData || getActiveWallData(state)

  const index = Math.floor(
    (wallData.points.length - 1) * totalPlotProgress
  )

  const previousPoint = wallData.points[index - 1]
  const o = {
    angle: 0,
    ...wallData.points[index],
  }

  o.x += MAP_OFFSET_X
  o.y += MAP_OFFSET_Y

  if (previousPoint) {
    o.angle =
      (1 -
        vec2.dot(
          vec2.normalize(vec2.create(), vec2.fromValues(o.x, o.y)),
          vec2.normalize(
            vec2.create(),
            vec2.fromValues(previousPoint.x, previousPoint.y)
          )
        )) *
      (previousPoint.x < o.x ? 1 : -1)
  }

  return o
}
