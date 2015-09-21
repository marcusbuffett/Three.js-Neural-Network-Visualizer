(function() {
  var camera, cube, geometry, material, render, renderer, scene;

  scene = require('scene');

  console.log(scene);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  geometry = new THREE.BoxGeometry(1, 1, 1);

  material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });

  cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  render = function(net) {
    return requestAnimationFrame(render);
  };

  render();

  camera.position.z = 5;

}).call(this);
