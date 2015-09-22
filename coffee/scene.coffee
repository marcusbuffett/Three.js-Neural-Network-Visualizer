module.exports = (net) ->
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera( 60,
                                        window.innerWidth / window.innerHeight,
                                        0.1,
                                        1000 )
  # camera = new THREE.OrthographicCamera( window.innerWidth / - 2,
                                         # window.innerWidth / 2,
                                         # window.innerHeight / 2,
                                         # window.innerHeight / - 2,
                                         # 1,
                                         # 1000 )

  renderer = new THREE.WebGLRenderer({alpha : true, antialias: true})
  renderer.setSize( window.innerWidth, window.innerHeight )
  console.log($('#webgl')[0])
  $('#webgl').append( renderer.domElement )
  orbit = new THREE.OrbitControls( camera, renderer.domElement )

  neurons = []
  connections = []

  width = 5
  height = 2
  size = 0.2
  info =
    error: 0
    iterations: 0


  setInfo = (newInfo) ->
    info = newInfo

  generateNeurons = (displayOpts) ->
    rows = net.sizes.length
    for row in [0...rows]
      rowSpacing = (height*2-size*rows)/(rows-1)
      y = size*(row)+rowSpacing*(row)
      yOffset = (rows*size+rowSpacing*(rows-1))/2
      neurons.push([])
      if row == 0 && displayOpts.grid
        constructor = sensorNode
      else if row == rows-1 && displayOpts.grid
        constructor = outputNode
      else if displayOpts.grid
        constructor = hiddenNode
      if displayOpts.grid
        displayGrid(row, y-yOffset, constructor)
      # else

  displayLayer = (row, y, nodeConstructor) ->
    cols = net.sizes[row]
    for col in [0...cols]
      colSpacing = (width*2-size*cols)/(cols-1 || 1)
      xOffset = (cols*size+colSpacing*(cols-1))/2
      x = size*(col)+colSpacing*(col)
      obj = nodeConstructor(size)
      obj.position.set(x-xOffset,y,0)
      obj.renderOrder = 1
      scene.add obj
      neurons[neurons.length - 1].push(obj)

  displayGrid = (row, y, nodeConstructor) ->
    cols = net.sizes[row]
    rowCols = Math.floor(Math.sqrt(cols))
    rows = Math.ceil(Math.sqrt(cols))
    rowSize = rowCols
    colSpacing = 1
    rowsHeight = (colSpacing*(rows-1))
    xOffset = (rowCols)/2
    for col in [0...cols]
      farX = colSpacing*col
      x = (farX)%rowSize
      z = Math.floor((farX)/rowSize)

      zOffset = (rowsHeight)/2
      obj = nodeConstructor(size)
      obj.position.set(x-xOffset,y,z-zOffset)
      obj.renderOrder = 1
      scene.add obj
      neurons[neurons.length - 1].push(obj)


  generateConnections = (neurons) ->
    for layer, r in neurons.slice(0, -1)
      nextLayer = neurons[r+1]
      for source, i in layer
        sourceImportance = 0
        for target, j in nextLayer
          material = new THREE.LineBasicMaterial({
            color: 0xFFFFFF
          })
          material.linewidth = 2
          # material.linewidth = Math.abs(net.weights[r+1][j][i])*5
          weightToNextLayer = net.weights[r+1][j][i]
          if weightToNextLayer > 0
            material.color.setHSL(0.5,0.5,0.5)
          if weightToNextLayer < 0
            material.color.setHSL(0.1,0.5,0.5)
          sourceImportance += Math.abs(weightToNextLayer)
          material.opacity = Math.pow(Math.abs(weightToNextLayer), 3)
          material.transparent = true

          geometry = new THREE.Geometry()
          geometry.vertices.push(
            source.position
            target.position
          )

          line = new THREE.Line( geometry, material )
          line.renderOrder = -Math.abs(weightToNextLayer)
          if Math.abs(weightToNextLayer) > 0.2
            scene.add line
            connections.push(line)
        sourceImportance = sourceImportance / nextLayer.length
        # if sourceImportance > 1
          # debugger
        # console.log("IMPORTANTCE : " + sourceImportance)
        sourceImportance = if sourceImportance > 3 then 3 else sourceImportance
        if r > 0
          source.scale.x = sourceImportance
          source.scale.y = sourceImportance
          source.scale.z = sourceImportance
        # if r == 0
          # source.scale.x = Math.pow(sourceImportance, .5)
          # source.scale.y = Math.pow(sourceImportance, .5)
          # source.scale.z = sourceImportance


  updateScene = (opts) ->
    generateNeurons(opts)
    generateConnections(neurons)

  sensorNode = (size) ->
    geometry = new THREE.BoxGeometry( size, size, size )
    material = new THREE.MeshBasicMaterial(
      color: 0xFFFFFF
    )
    cube = new THREE.Mesh( geometry, material )
    return cube

  hiddenNode = (size) ->
    geometry = new THREE.SphereGeometry(size/2, 60)
    material = new THREE.MeshBasicMaterial(
      color: 0xFFFFFF
    )
    cube = new THREE.Mesh( geometry, material )
    return cube

  outputNode = (size) ->
    geometry = new THREE.BoxGeometry( size, size, size )
    material = new THREE.MeshBasicMaterial(
      color: 0xFFFFFF
    )
    cube = new THREE.Mesh( geometry, material )
    return cube

  camera.position.z = 10

  updateAndRender = (opts)->
    for i in [scene.children.length..0]
      obj = scene.children[ i ]
      if obj != camera
        scene.remove(obj)
    neurons = []
    connections = []
    updateScene(opts)
    $($('#info p').first()).text("Error : #{Math.round(info.error * 100) / 100}")
    $($('#info p').last()).text("Iterations : #{info.iterations}")

  render = () ->
    requestAnimationFrame render
    renderer.render scene, camera

  render()

  setNet = (n) ->
    net = n

  module.exports = {
    scene: scene
    render: render
    updateAndRender: updateAndRender
    updateScene: updateScene
    setInfo: setInfo
    setNet: setNet
  }
