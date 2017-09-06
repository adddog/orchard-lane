import Q from "bluebird"
import Xhr from "xhr-request"
import * as THREE from "three"

const xhr = Q.promisify(Xhr)

const Wall = (d, Height, numPoints = 20) => {
  const { points, position } = d
  console.log(points);
  var curve1 = new THREE.SplineCurve(
    points.map(p => new THREE.Vector2(p.x, p.y))
  )

  var path1 = new THREE.Path(curve1.getPoints(numPoints))
  var spline1Object = new THREE.Line(
    path1.createPointsGeometry(numPoints),
    new THREE.LineBasicMaterial()
  )

  var newVert = function(geometry) {
    var positions = []
    var faces = []
    for (var i = 0; i < geometry.vertices.length; i++) {
      positions.push(
        new THREE.Vector3(
          geometry.vertices[i].y,
          0,
          geometry.vertices[i].x,
        )
      )
      positions.push(
        new THREE.Vector3(
          geometry.vertices[i].y,
          Height,
          geometry.vertices[i].x,
        )
      )
    }

    for (var k = 0; k < positions.length - 2; k++) {
      faces.push(new THREE.Face3(k, k + 1, k + 2))
    }

    return {
      vertices: positions,
      faces: faces,
    }
  }

  const custom = newVert(spline1Object.geometry)
  var geometry = new THREE.Geometry()
  geometry.vertices = custom.vertices
  geometry.faces = custom.faces
  geometry.computeBoundingBox()
  geometry.center()

  var m = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
      side: THREE.DoubleSide,
    })
  )
  m.drawMode = THREE.TriangleStripDrawMode
  //m.rotateZ(Math.PI)
  m.position.set(
    position.y + geometry.boundingBox.max.x,
    -Height,
    position.x + geometry.boundingBox.max.z,
    //position.y + geometry.boundingBox.max.y / 2
  )
  return {
    mesh: m,
    line: spline1Object,
  }
}

export default (
  data,
  opt = {
    height: 1,
  }
) => data.map(d => Wall(d, 3))
