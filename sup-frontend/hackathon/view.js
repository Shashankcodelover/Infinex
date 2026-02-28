// ====================================
// View Hackathons Logic
// ====================================

const API_BASE_URL = 'http://localhost:5000/api';
let allHackathons = [];

// Load hackathons on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
    }
    loadHackathons();
});

// Load all hackathons
async function loadHackathons() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/hackathons`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            allHackathons = await response.json();
            displayHackathons(allHackathons);
        } else {
            showMessage('Failed to load hackathons', 'error');
        }
    } catch (error) {
        console.error('Error loading hackathons:', error);
        showMessage('Error loading hackathons', 'error');
    }
}

// Display hackathons
function displayHackathons(hackathons) {
    const container = document.getElementById('hackathonsList');
    const emptyState = document.getElementById('emptyState');

    if (hackathons.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';

    hackathons.forEach(h => {
        const status = getHackathonStatus(h.startDate, h.endDate);
        const card = document.createElement('div');
        card.className = 'hackathon-card';
        card.innerHTML = `
            <div class="card-header">
                ${h.logo ? `<img src="http://localhost:5000/${h.logo}" alt="${h.name}"/>` : '<div class="no-logo">📋</div>'}
            </div>
            <div class="card-body">
                <h3>${h.name}</h3>
                <p><strong>Status:</strong> <span style="color: ${getStatusColor(status)};">${status}</span></p>
                <p>${h.description.substring(0, 80)}...</p>
                <p>📅 ${new Date(h.startDate).toDateString()} - ${new Date(h.endDate).toDateString()}</p>
                <p>📍 ${h.location}</p>
                <p>💰 Prize: $${h.prizePool || 0}</p>
                <p>👥 Max: ${h.maxParticipants || 'N/A'} participants</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="editHackathon('${h._id}')">Edit</button>
                    <button class="btn btn-secondary" onclick="deleteHackathon('${h._id}')">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Get hackathon status
function getHackathonStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Ongoing';
}

// Get status color
function getStatusColor(status) {
    switch(status) {
        case 'Upcoming': return '#00f5ff';
        case 'Ongoing': return '#10b981';
        case 'Completed': return '#ef4444';
        default: return '#ffffff';
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allHackathons.filter(h => 
        h.name.toLowerCase().includes(searchTerm) ||
        h.description.toLowerCase().includes(searchTerm) ||
        h.location.toLowerCase().includes(searchTerm)
    );
    displayHackathons(filtered);
});

// Filter by status
document.getElementById('statusFilter').addEventListener('change', (e) => {
    const status = e.target.value;
    if (!status) {
        displayHackathons(allHackathons);
        return;
    }

    const filtered = allHackathons.filter(h => {
        const hStatus = getHackathonStatus(h.startDate, h.endDate);
        return hStatus.toLowerCase() === status.toLowerCase();
    });
    displayHackathons(filtered);
});

// Edit hackathon
function editHackathon(id) {
    // Redirect to edit page with ID
    window.location.href = `create.html?edit=${id}`;
}

// Delete hackathon
async function deleteHackathon(id) {
    if (confirm('Are you sure you want to delete this hackathon?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hackathons/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showMessage('Hackathon deleted successfully', 'success');
                loadHackathons();
            } else {
                showMessage('Failed to delete hackathon', 'error');
            }
        } catch (error) {
            console.error('Error deleting hackathon:', error);
            showMessage('Error deleting hackathon', 'error');
        }
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
});

// Show message helper
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
