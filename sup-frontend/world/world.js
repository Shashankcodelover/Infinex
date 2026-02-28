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
