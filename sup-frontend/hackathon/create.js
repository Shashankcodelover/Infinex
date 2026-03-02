// ====================================
// Create Hackathon Logic
// ====================================

const API_BASE_URL = 'http://localhost:5000/api';

// Form submission handler
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../auth/login.html';
            return;
        }

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('date', document.getElementById('startDate').value);
        formData.append('location', document.getElementById('location').value);
        formData.append('hostingLink', document.getElementById('hostingLink').value);
        formData.append('prizePool', document.getElementById('prizePool').value || 0);
        formData.append('maxParticipants', document.getElementById('maxParticipants').value || 100);
        
        if (document.getElementById('logo').files[0]) {
            formData.append('logo', document.getElementById('logo').files[0]);
        }

        const response = await fetch(`${API_BASE_URL}/hackathons`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Hackathon created successfully!', 'success');
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 2000);
        } else {
            showMessage(data.message || 'Error creating hackathon', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
});

// Logout function
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
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
    }
});
