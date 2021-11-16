window.addEventListener("load", init, false);

// Loading
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = true;
const normalTexture = textureLoader.load("textures/NormalMap.png");

// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();
let renderer;

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0xfa693e);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Rocket
let rocket;
let loader = new THREE.GLTFLoader();
  loader.crossOrigin = true;
  loader.load( 'https://www.stivaliserna.com/assets/rocket/rocket.gltf',
    (gltf) => {
      rocket = gltf.scene;
      rocket.scale.multiplyScalar(1 / 1000); 
      rocket.position.set(-1.5,1,-.5);
      rocket.rotation.y += 0.4;
      rocket.rotation.z -= 2;
      scene.add(rocket);
    }
);


let pointLight, pointLight2;
function initLights() {

  // Lights
  // Light 1
  pointLight = new THREE.PointLight(0xffffff, 0.1);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  // Light 2
  pointLight2 = new THREE.PointLight(0xffb833, 2);
  pointLight2.position.set(3, 4.8, 3);
  pointLight2.intensity = 1.6;
  scene.add(pointLight2);


  // GUI Debugger
  gui.add(pointLight2.position, "y").min(-3).max(30).step(0.01);
  gui.add(pointLight2.position, "x").min(-6).max(3).step(0.01);
  gui.add(pointLight2.position, "z").min(-3).max(3).step(0.01);
  gui.add(pointLight2, "intensity").min(0).max(10).step(0.01);

}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let camera;

function initCamera() {
    /**
   * Camera
   */
  // Base camera
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1.5;
  scene.add(camera);

}

function initControls() {
  // Controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.enableDamping = true

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Append renderer to html
  document.body.appendChild(renderer.domElement);

}


let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = sizes.width / 2;
const windowY = sizes.height / 2;

function onDocumentMouseMove(e) {
  mouseX = e.clientX - windowX;
  mouseY = e.clientY - windowY;
}

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);
  sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
  sphere.position.z -= 0.5 * (targetY - sphere.rotation.x);

  


  // Update Orbital Controls
  // controls.update()


  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

function init() {
  
  // Update size object and window center on window resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  initCamera();
  initControls();
  initLights();

    /**
   * Animate
   */
  document.addEventListener("mousemove", onDocumentMouseMove);


  tick();

}



