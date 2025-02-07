// Ensure Three.js is properly loaded
console.log("Three.js script loaded!");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Black background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Function to create a star
function createStar(size, color) {
    const geometry = new THREE.SphereGeometry(size, 12, 12);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
    return star;
}

// Generate twinkling small stars
const stars = [];
for (let i = 0; i < 300; i++) {
    const star = createStar(0.1, 0xffffff);
    scene.add(star);
    stars.push(star);
}

// Create a big central star shape
const starShape = new THREE.Shape();
const spikes = 5;
const outerRadius = 3;
const innerRadius = 1.5;

for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    starShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
}
starShape.closePath();

const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
const bigStarGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
const bigStarMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.8, roughness: 0.2 });
const bigStarMesh = new THREE.Mesh(bigStarGeometry, bigStarMaterial);
bigStarMesh.position.set(0, 0, 0);
scene.add(bigStarMesh);

// Raycasting for hover effect
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([bigStarMesh]);
    for (const intersect of intersects) {
        intersect.object.material.color.set(Math.random() * 0xffffff);
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Make small stars twinkle and move slowly
    stars.forEach((star) => {
        star.material.color.setRGB(Math.random(), Math.random(), Math.random());
        star.position.z += 0.02;
        if (star.position.z > 15) star.position.z = -15;
    });
    
    // Rotate the big star
    bigStarMesh.rotation.z += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("Scene initialized with twinkling stars and a rotating big star that changes color on hover.");
