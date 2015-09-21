scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera( 75,
                                      window.innerWidth / window.innerHeight,
                                      0.1,
                                      1000 )
renderer = new THREE.WebGLRenderer({alpha : true, antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

controls = new THREE.OrbitControls( camera )
controls.addEventListener( 'change', render )

neurons = []
connections = []

# light = new THREE.PointLight( 0xff0000, 1, 100 )
# light.position.set( 0, 0, 0 )
# scene.add( light )

colSpacing = 0.5
rowSpacing = 1.0
size = 0.5

generateNeurons = (net) ->
  rows = net.sizes.length
  for row in [0...rows]
    y = size*(row)+rowSpacing*(row)
    yOffset = (rows*size+rowSpacing*(rows-1))/2
    cols = net.sizes[row]
    neurons.push([])
    for col in [0...cols]
      xOffset = (cols*size+colSpacing*(cols-1))/2
      x = size*(col)+colSpacing*(col)
      if row == 0
        obj = sensorNode(size)
      else if row == rows-1
        obj = outputNode(size)
      else
        obj = hiddenNode(size)
      obj.position.set(x-xOffset,y-yOffset,Math.random()*1)
      obj.renderOrder = 1
      scene.add obj
      neurons[neurons.length - 1].push(obj)
  return neurons

generateConnections = (net, neurons) ->
  for layer, r in neurons.slice(0, -1)
    nextLayer = neurons[r+1]
    for source, i in layer
      for target, j in nextLayer
        material = new THREE.LineBasicMaterial({
          color: 0xB4B4B4
        })
        material.linewidth = 1
        # material.linewidth = Math.abs(net.weights[r+1][j][i])*5
        material.opacity = Math.abs(net.weights[r+1][j][i])
        material.transparent = true

        geometry = new THREE.Geometry()
        geometry.vertices.push(
          new THREE.Vector3(source.position.x, source.position.y, source.position.z-0.1),
          new THREE.Vector3(target.position.x, target.position.y, target.position.z-0.1)
        )

        line = new THREE.Line( geometry, material )
        line.renderOrder = 0
        scene.add line
        connections.push(line)

useNet = (net) ->
  generateNeurons(net)
  # console.log(net)
  # console.log(neurons)
  generateConnections(net, neurons)

sensorNode = (size) ->
  geometry = new THREE.BoxGeometry( size, size, 0 )
  material = new THREE.MeshBasicMaterial(
    color: 0xC4C4C4
  )
  cube = new THREE.Mesh( geometry, material )
  return cube

hiddenNode = (size) ->
  geometry = new THREE.CircleGeometry(size/2, 20)
  material = new THREE.MeshBasicMaterial(
    color: 0x757575
  )
  cube = new THREE.Mesh( geometry, material )
  return cube

outputNode = (size) ->
  geometry = new THREE.BoxGeometry( size, size, 0 )
  material = new THREE.MeshBasicMaterial(
    color: 0xC4C4C4
  )
  cube = new THREE.Mesh( geometry, material )
  return cube

camera.position.z = 5

render = (net) ->
  for i in [scene.children.length..0]
    obj = scene.children[ i ]
    if obj != camera
      scene.remove(obj)
  neurons = []
  connections = []
  useNet(net)
  renderer.render(scene, camera)


module.exports = {
  scene: scene
  render: render
  useNet: useNet
}
