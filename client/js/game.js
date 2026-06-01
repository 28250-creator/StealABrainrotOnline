// Game Logic
let socket = io();
let currentUser = null;
let scene, camera, renderer;
let player = { position: { x: 0, y: 1, z: 5 } };

// Initialize game when login is successful
function initializeGame(userData) {
    currentUser = userData;
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('loginScreen').classList.remove('active');
    setupThreeJS();
    setupSocketEvents();
    updateHUD();
}

// Setup Three.js
function setupThreeJS() {
    const container = document.getElementById('gameContainer');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Player (simple cube for now)
    const playerGeometry = new THREE.BoxGeometry(0.8, 1.8, 0.8);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6347 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.copy(camera.position);
    playerMesh.position.y = 0.9;
    playerMesh.castShadow = true;
    scene.add(playerMesh);
    
    // Base structure
    createBase();
    
    // Money spawn zones
    createMoneySpawns();
    
    // Red spawner for Brainrots
    createBrainrotSpawner();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    animate();
}

// Create player base
function createBase() {
    const baseGeometry = new THREE.BoxGeometry(10, 0.5, 10);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.receiveShadow = true;
    scene.add(base);
    
    // Walls
    for (let i = 0; i < 4; i++) {
        const wallGeometry = new THREE.BoxGeometry(10, 3, 0.5);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xA0522D });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.y = 1.5;
        wall.castShadow = true;
        wall.receiveShadow = true;
        
        if (i === 0) wall.position.z = -5;
        else if (i === 1) wall.position.z = 5;
        else if (i === 2) { wall.rotation.y = Math.PI / 2; wall.position.x = -5; }
        else { wall.rotation.y = Math.PI / 2; wall.position.x = 5; }
        
        scene.add(wall);
    }
}

// Money spawns (green circles)
function createMoneySpawns() {
    for (let i = 0; i < 5; i++) {
        const moneyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const moneyMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, emissive: 0x00AA00 });
        const money = new THREE.Mesh(moneyGeometry, moneyMaterial);
        money.position.set(
            Math.random() * 10 - 5,
            0.5,
            Math.random() * 10 - 5
        );
        money.castShadow = true;
        scene.add(money);
    }
}

// Red spawner for Brainrots
function createBrainrotSpawner() {
    const spawnerGeometry = new THREE.PlaneGeometry(15, 2);
    const spawnerMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, emissive: 0xAA0000 });
    const spawner = new THREE.Mesh(spawnerGeometry, spawnerMaterial);
    spawner.rotation.x = -Math.PI / 2;
    spawner.position.set(0, 0.1, -15);
    scene.add(spawner);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Update HUD
function updateHUD() {
    document.getElementById('moneyDisplay').textContent = currentUser.money || 0;
    document.getElementById('brainrotCount').textContent = currentUser.brainrots?.length || 0;
    document.getElementById('slotCount').textContent = currentUser.slots || 1;
    document.getElementById('rebirthDisplay').textContent = currentUser.rebirths || 0;
}

// Socket Events
function setupSocketEvents() {
    socket.emit('join_game', { username: currentUser.username });
    
    socket.on('player_move', (data) => {
        // Update other players' positions
        console.log(`${data.username} moved`);
    });
    
    socket.on('chat_message', (data) => {
        console.log(`${data.username}: ${data.message}`);
    });
    
    socket.on('global_notification', (data) => {
        showGlobalMessage(data.message);
    });
}

function showGlobalMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 1.5em;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 10000);
}
