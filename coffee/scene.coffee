scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera( 75,
                                      window.innerWidth / window.innerHeight,
                                      0.1,
                                      1000 )
renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

net = {}

# light = new THREE.PointLight( 0xff0000, 1, 100 )
# light.color.set(new THREE.Color("hsl(50, 100%, 50%)"))
# light.position.set( 50, 50, 50 )
# scene.add( light )

useNet = (net) ->
  colSpacing = 0.5
  rowSpacing = 0.5
  size = 0.5
  rows = net.sizes.length
  console.log(net)
  neurons = []
  # for i in [0..]
  for row in [0...rows]
    y = size*(row)+rowSpacing*(row)
    yOffset = (rows*size+rowSpacing*(rows-1))/2
    cols = net.hiddenSizes[row]
    console.log("y : #{y}")
    console.log("yOffset : #{yOffset}")
    for col in [0...cols]
      xOffset = (cols*size+colSpacing*(cols-1))/2
      x = size*(col)+colSpacing*(col)
      geometry = new THREE.BoxGeometry( size, size, 0.1 )
      material = new THREE.MeshBasicMaterial(
        color: 0xFF0000
      )
      # console.log((new THREE.Color("hsl(0.5, 0.5, 0.5)")).getHex().toString())
      cube = new THREE.Mesh( geometry, material )
      cube.position.set(x-xOffset,y-yOffset,0)
      edges = new THREE.EdgesHelper( cube, 0x00ff00 )
      scene.add edges
      scene.add cube

camera.position.z = 5

render = (net) ->
  # requestAnimationFrame( render )
  renderer.render( scene, camera )


module.exports = {
  scene: scene
  render: render
  useNet: useNet
}
