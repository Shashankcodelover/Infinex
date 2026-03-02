const API_BASE_URL = 'http://localhost:5000/api';

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    loadProfile(user._id || user.id);
});

// Load user profile
async function loadProfile(userId) {
    if (!userId) {
        showMessage('Cannot load profile: missing user id.', 'error');
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            populateForm(user);
            updateProfileCard(user);
        } else {
            showMessage('Failed to load profile', 'error');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Error loading profile', 'error');
    }
}

// Populate form with user data
function populateForm(user) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('state').value = user.state || '';
    document.getElementById('bio').value = user.bio || '';
    document.getElementById('experience').value = user.experience || 'Beginner';
    document.getElementById('github').value = user.github || '';
    document.getElementById('portfolio').value = user.portfolio || '';
    document.getElementById('languages').value = (user.languages || []).join(', ');
    document.getElementById('skills').value = (user.skills || []).join(', ');
    document.getElementById('domains').value = (user.domains || []).join(', ');
    
    if (user.profilePicture) {
        document.getElementById('profileImg').src = `http://localhost:5000/${user.profilePicture}`;
    }
}

// Update profile card display
function updateProfileCard(user) {
    document.getElementById('profileName').textContent = user.name || 'User';
    document.getElementById('profileState').textContent = user.state || 'Location not set';
}

// Handle profile picture upload
document.getElementById('profilePictureInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('profileImg').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('state', document.getElementById('state').value);
        formData.append('bio', document.getElementById('bio').value);
        formData.append('experience', document.getElementById('experience').value);
        formData.append('github', document.getElementById('github').value);
        formData.append('portfolio', document.getElementById('portfolio').value);
        
        // Convert comma-separated strings to arrays
        const languages = document.getElementById('languages').value.split(',').map(s => s.trim()).filter(s => s);
        const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s);
        const domains = document.getElementById('domains').value.split(',').map(s => s.trim()).filter(s => s);
        
        formData.append('languages', JSON.stringify(languages));
        formData.append('skills', JSON.stringify(skills));
        formData.append('domains', JSON.stringify(domains));

        // Add profile picture if changed
        const fileInput = document.getElementById('profilePictureInput');
        if (fileInput.files[0]) {
            formData.append('profilePicture', fileInput.files[0]);
        }

        const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        let data = {};
        try {
            data = await response.json();
        } catch (parseErr) {
            console.warn('Failed to parse profile update response', parseErr);
        }

        if (response.ok) {
            showMessage('Profile updated successfully!', 'success');
            // Update stored user data
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 2000);
        } else {
            showMessage(data.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile', 'error');
    }
});

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
