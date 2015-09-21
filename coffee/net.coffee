getNeurons = (net) ->
  console.log(net)
  rows = net.hiddenSizes.length
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


