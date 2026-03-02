// ====================================
// World Page - Additional Functionality
// ====================================

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (confirm('Return to dashboard?')) {
            window.location.href = '../dashboard/dashboard.html';
        }
    }
});

console.log('🌍 Welcome to Infinex 3D World!');
console.log('Use mouse to navigate:');
console.log('  - Left drag to rotate');
console.log('  - Scroll to zoom');
console.log('  - Right drag to pan');
console.log('  - Press ESC to return to dashboard');

// house stage management
let houseStage = parseInt(localStorage.getItem('houseStage') || '0', 10);
function saveStage() { localStorage.setItem('houseStage', houseStage); }
function addRoof() {
    if (houseStage >= 1) return;
    houseStage = 1;
    saveStage();
    const scene = window.scene;
    if (!scene) return;
    // simple triangular roof above origin
    const geometry = new THREE.ConeGeometry(3.5, 2, 4);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const roof = new THREE.Mesh(geometry, material);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 3.5, 0);
    scene.add(roof);
}
function addSecondFloor() {
    if (houseStage >= 2) return;
    if (houseStage < 1) {
        alert('Add roof first');
        return;
    }
    houseStage = 2;
    saveStage();
    const scene = window.scene;
    if (!scene) return;
    const geometry = new THREE.BoxGeometry(6, 3, 6);
    const material = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    const second = new THREE.Mesh(geometry, material);
    second.position.set(0, 3.5 + 1.5, 0);
    second.castShadow = true;
    second.receiveShadow = true;
    scene.add(second);
}

// call functions on load to reconstruct stage
window.addEventListener('load', () => {
    if (houseStage >= 1) addRoof();
    if (houseStage >= 2) addSecondFloor();

    const roofBtn = document.getElementById('roofBtn');
    const floorBtn = document.getElementById('floorBtn');
    if (roofBtn) {
        if (houseStage >= 1) roofBtn.disabled = true;
        roofBtn.addEventListener('click', () => {
            addRoof();
            roofBtn.disabled = true;
        });
    }
    if (floorBtn) {
        if (houseStage >= 2) floorBtn.disabled = true;
        floorBtn.addEventListener('click', () => {
            addSecondFloor();
            floorBtn.disabled = true;
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // reload page to clear added geometry
            houseStage = 0;
            saveStage();
            window.location.reload();
        });
    }
});
