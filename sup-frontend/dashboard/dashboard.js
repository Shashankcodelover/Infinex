// ====================================
// Dashboard Navigation & Initialization
// ====================================

const API_BASE_URL = 'http://localhost:5000/api';

// Navigation function
function navigateTo(page) {
    if (page === 'create') {
        window.location.href = '../hackathon/create.html';
    } else if (page === 'view') {
        window.location.href = '../hackathon/view.html';
    } else if (page === 'world') {
        window.location.href = '../world/world.html';
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../auth/login.html';
            return;
        }

        // Fetch hackathons
        const response = await fetch(`${API_BASE_URL}/hackathons`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateStats(data);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update statistics
function updateStats(data) {
    const hackathons = data.hackathons || [];
    document.getElementById('statHackathons').textContent = hackathons.length;
    
    const totalParticipants = hackathons.reduce((sum, h) => sum + (h.participants || 0), 0);
    document.getElementById('statParticipants').textContent = totalParticipants;
    
    const totalTeams = hackathons.reduce((sum, h) => sum + (h.teams || 0), 0);
    document.getElementById('statTeams').textContent = totalTeams;
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
});

// User greeting
function displayUserGreeting() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.username) {
        document.getElementById('userGreeting').textContent = `Welcome back, ${user.username}!`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayUserGreeting();
    loadDashboardData();
});
