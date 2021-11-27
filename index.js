window.addEventListener("load", init, false);

// Loading
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = true;
const normalTexture = textureLoader.load("textures/venusmap.jpeg");

// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();
let renderer;

// Parent
let orbit = new THREE.Object3D();
scene.add( orbit );

let pivot = new THREE.Object3D();
pivot.rotation.z = 0;
orbit.add(pivot);

let pivot2 = new THREE.Object3D();
pivot2.rotation.z = 1;
orbit.add(pivot2);

let pivot3 = new THREE.Object3D();
pivot3.rotation.z = 0.5;
orbit.add(pivot3);

let pivot4 = new THREE.Object3D();
pivot4.rotation.z = 0;
orbit.add(pivot4);

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
let rocket;
let satellite;
/*
let loader = new THREE.GLTFLoader();
  loader.crossOrigin = true;
  loader.load( 'http://localhost:8080/models/falcon9/scene.gltf',
    (gltf) => {
      rocket = gltf.scene;
      rocket.scale.multiplyScalar(1 / 20000); 
      rocket.position.set(-1,0.5,0.9);
      rocket.rotation.y += 0.4;
      rocket.rotation.z -= 2;
      scene.add(rocket);
      pivot.add(rocket);
    }
);
*/
let loader2 = new THREE.GLTFLoader();
  loader2.crossOrigin = true;
  loader2.load( 'http://localhost:8080/models/satellite/scene.gltf',
    (gltf) => {
      satellite = gltf.scene;
      satellite.scale.multiplyScalar(1 / 5); 
      satellite.position.set(-1,0,0);
      satellite.rotation.y += 0.4;
      satellite.rotation.z -= 2;
      scene.add(satellite);
      pivot2.add(satellite);
    }
);

let sat2;
let loader3 = new THREE.GLTFLoader();
  loader3.crossOrigin = true;
  loader3.load( 'http://localhost:8080/models/satelliteNew/scene.gltf',
    (gltf) => {
      sat2 = gltf.scene;
      sat2.scale.multiplyScalar(1 / 200); 
      sat2.position.set(0.85,0,0);
      sat2.rotation.y += 0.2;
      sat2.rotation.z -= 3 ;
      scene.add(sat2);
      pivot3.add(sat2);
    }
);

let sat3;
let loader4 = new THREE.GLTFLoader();
  loader4.crossOrigin = true;
  loader4.load( 'http://localhost:8080/models/iss/scene.gltf',
    (gltf) => {
      sat3 = gltf.scene;
      sat3.scale.multiplyScalar(1 / 70); 
      sat3.position.set(0.8,0.6,0);
      sat3.rotation.y += 0.8;
      sat3.rotation.z -= 4;
      scene.add(sat3);
      pivot4.add(sat3);
    }
);



// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0xfa693e);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Orbit logic sat retire and rocket gets near
let axis = new THREE.Vector3(0,1,0);
let ySpeed = 0.1, xSpeed = 0.1, zSpeed = 0.1, speed = 0.001;
let flag = false;
let interval;
let counter = 0, angleRot = 0.01;

//event listener for changing speed of orbit
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode == 32) {
      //interval = setInterval(orbitatePlanet, 10);
      if(speed < 0.01) speed += 0.001;
      flag = true
    }else if(keyCode == 83) {
      //clearInterval(interval);
      flag = false;
      if(speed > -0.01) speed -= 0.001;
    }
};

function orbitatePlanet(object) {
  if (counter == 2000) {
    clearInterval(interval);
    counter = 0;
    flag = false;
  } else {
    counter++;
    rocket.rotateOnAxis( axis, angleRot );
    orbit.rotation.y += 0.001;
  }
}

function stopOrbit(object) {
  object.position.set(-1,0,0.9);
}


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
  

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Controls
  

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
let angle = 90;

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.2 * elapsedTime;

  sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);
  sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
  sphere.position.z -= 0.5 * (targetY - sphere.rotation.x);

  pivot2.rotation.y += 0.001 + speed;
  pivot2.rotation.x += 0.001 + speed;
  
  pivot3.rotation.y += 0.002 + speed;
  pivot3.rotation.x += 0.002 + speed;

  pivot4.rotation.y += 0.0005 + speed;
  pivot4.rotation.x += 0.0005 + speed;
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



