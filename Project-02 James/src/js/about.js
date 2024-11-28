import * as THREE from '/src/js/three.module.js';
//import { OrbitControls } from './src/js/OrbitControls.js';
import { RenderPass } from '/src/js/RenderPass.js';
import { EffectComposer } from '/src/js/EffectComposer.js';
import { UnrealBloomPass } from '/src/js/UnrealBloomPass.js';

import starsTexture from '/public/img/stars.jpg';
import sunTexture from '/public/img/sun.jpg';

const renderer = new THREE.WebGLRenderer({ antialias: true}); 
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); 

const camera = new THREE.PerspectiveCamera( 
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(50, 0, 0);

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // bloom strength
    0.5,
    0.1
);
composer.addPass(bloomPass);
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 0.7; // blurr

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(8, 30, 30); // MAKE PHOTO
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
sun.position.set(0, 0, 0);

// moon orbiting my photo
const moonGeo = new THREE.SphereGeometry(2, 16, 16);
const moonMat = new THREE.MeshBasicMaterial ({
    map: textureLoader.load(sunTexture)
});
const moon = new THREE.Mesh(moonGeo, moonMat);
scene.add(moon);
sun.Mesh.add(moon);
moon.position.set(-20, 0, 0);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 600); //sunlight
scene.add(pointLight);

let upswing = true;
function animate() {
    // Self-rotation
    if(upswing){
        sun.position.y += 0.01;
        moon.position.y += 0.02;
        if(sun.position.y >= 1) {
            upswing = false;
        }
    }
    else {
        sun.position.y -= 0.01;
        moon.position.y += 0.02;
        if(sun.position.y <= -1) {
            upswing = true;
        }
    }

    moon.obj.rotateY(0.001);

    renderer.render(scene, camera);
    camera.lookAt(0, 0, 20);

    composer.render();
    requestAnimationFrame(animate);
}
animate();


window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('Description').textContent = "Hello! My name is James Simon. I'm a physics programmer, game developer, and web designer in Los Angeles majoring in Physics/Computer Science at the University of Southern California. Growing up next to NASA Road 1 in Houston, I was always facinated with space and the wonderous mechanics of the universe. This fostered a love for physics and programming, with my early work reflecting that. "
