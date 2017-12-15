import { isObject, values, keys, pick } from "lodash"
import ThreeModel from "orchardModels/threeModel"
import VideoModel from "orchardModels/videoModel"

import Walls from "./walls"
import Floor from "./floor"
import * as THREE from "three"
const { Vector3 } = THREE
import Q from "bluebird"
import Xhr from "xhr-request"
const xhr = Q.promisify(Xhr)

export function polarToVector3(lon, lat, radius, vector) {
  vector = vector || new Vector3()
  const phi = THREE.Math.degToRad(90 - lat)
  const theta = THREE.Math.degToRad(lon)

  vector.set(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )

  return vector
}

const OrchardLane = threeScene => {

  threeScene.start()
/*
  const { scene } = threeScene.scene.renderingContext
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  })

  var group = new THREE.Group()
  scene.add(group)

  const floor = Floor()
  floor.rotateX(Math.PI / 2)
  floor.position.y = -3
  group.add(floor)
  const walls = Walls(mapData.get("wallData")).map(({ mesh }) => {
    group.add(mesh)
  })

  VideoModel.observable.on("videoId", (value, prev) => {
    const { currentVideoModelData } = VideoModel
    console.log(
      "currentVideoModelData.initialRotation",
      currentVideoModelData.initialRotation
    )
    threeScene.scene.updateConfig({
      initialRotation: currentVideoModelData.initialRotation,
    })
  })

  ThreeModel.observable.on("plotterProgress", (value, prev) => {
    const { previousPlotterPoint, currentPlotterPoint } = ThreeModel

    const angleDifference =
      previousPlotterPoint.angle - currentPlotterPoint.angle

    threeScene.scene.renderingContext.controls.lon.add(
      angleDifference * 360
    )

    if (currentPlotterPoint) {
      group.position.x = -currentPlotterPoint.y
      group.position.y = -4
      group.position.z = -currentPlotterPoint.x
    }

    //threeScene.scene.renderingContext.position = cameraPosition
    //threeScene.scene.updateConfig({
    //cameraPosition: cameraPosition,
    //})
  })*/
  return {}
}
export default OrchardLane
