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
  const { mapData } = ThreeModel
  const rawData = mapData.get("plotPaths")
  console.log(rawData)

  if (!mapData.size) {
    throw new Error(`ThreeModel hasn't loaded`)
  }

  threeScene.start()

  threeScene.scene.setHandlers({
    onWallClicked: mesh => {
      if(mesh){
        if (mesh.object.userData && mesh.object.userData.videoId) {
          const totalFaces = mesh.object.geometry.faces.length
          VideoModel.updateValue("videoId", mesh.object.userData.videoId)
          //Model.updateValue("plotterProgress", Math.floor(mesh.faceIndex / totalFaces))
        }
      }
    },
  })

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
  const walls = Walls(mapData.get("wallData"))
  .map(({ mesh }) => {
    group.add(mesh)
  })

  threeScene.scene.updateConfig({
    cameraPosition: { z: 0, x: 0, y: 20 },
  })

  ThreeModel.observable.on("plotterProgress", (value, prev) => {
    const currentPlotterPoint = ThreeModel.currentPlotterPoint
    if (currentPlotterPoint) {
      group.position.x = -currentPlotterPoint.y
      group.position.y = -4
      group.position.z = -currentPlotterPoint.x
    }
    //threeScene.scene.renderingContext.position = cameraPosition
    //threeScene.scene.updateConfig({
    //cameraPosition: cameraPosition,
    //})
  })
  /*
  const startPlane = p => {
    let time = 0
    let index = 0
    threeScene.scene.on("render", time => {
      const now = performance.now()
      if (now - time >= 24) {
        if (index < p[3].length) {
          //clickPlane.position.set(p[3][index].vector3d)
        }
        index++
        time = now
      }
    })
  }

  xhr(`json/STITCH_TAKE_BM_01.json`, { json: true })
    .then(d => {
      const { w, h, fr } = d
      return d.layers.map(layer => {
        return layer.ks.p.k.map(position => {
          if (isObject(position)) {
            if (position.e) {
              const pos = {
                x: position.e[0] / w,
                y: position.e[1] / h,
                z: position.e[2],
              }
              pos.lat = pos.y * 180
              pos.lon = pos.x * 360
              pos.vector3d = polarToVector3(pos.lon, pos.lat, 1)
              return pos
            }
            return []
          } else {
            return position
          }
        })
      })
    })
    .then(positions => {
      startPlane(positions)
    })
*/
  return {}
}
export default OrchardLane
