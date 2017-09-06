import * as THREE from "three"

const Floor = () => {
  var geometry = new THREE.PlaneBufferGeometry(200, 200, 32)
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
    side: THREE.DoubleSide,
  })
  const m = new  THREE.Mesh(geometry, material)
  m.position.x = 100
  m.position.z = 100
  return m
}

export default Floor