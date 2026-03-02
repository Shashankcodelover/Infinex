const API_BASE_URL = 'http://localhost:5000/api';

let currentUserId = null;
let currentToken = null;
let chatConvId = null;
let chatPollInterval = null;

// Load teams, recommendations and invites on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    currentToken = token;
    currentUserId = user._id || user.id;

    loadMyTeams(currentUserId);
    loadRecommendations(currentUserId);
    loadPendingInvites(currentUserId);
    loadNotifications();
});

// Create Team
document.getElementById('createTeamForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;

        const teamName = document.getElementById('teamName').value;
        const description = document.getElementById('description').value;
        const maxMembers = parseInt(document.getElementById('maxMembers').value) || 5;
        const domains = document.getElementById('domains').value
            .split(',').map(s => s.trim()).filter(s => s);

        const response = await fetch(`${API_BASE_URL}/teams`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName,
                description,
                leaderId: userId,
                domains,
                maxMembers
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Team created successfully!', 'success', 'createTeamMessage');
            document.getElementById('createTeamForm').reset();
            loadMyTeams(userId);
        } else {
            showMessage(data.message || 'Failed to create team', 'error', 'createTeamMessage');
        }
    } catch (error) {
        console.error('Error creating team:', error);
        showMessage('Error creating team', 'error', 'createTeamMessage');
    }
});

// Load my teams
async function loadMyTeams(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/teams/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const teams = await response.json();
            displayMyTeams(teams, userId);
            loadNotifications();
        } else {
            showMessage('Failed to load teams', 'error', 'globalMessage');
        }
    } catch (error) {
        console.error('Error loading teams:', error);
        showMessage('Error loading teams', 'error', 'globalMessage');
    }
}

// Display my teams
function displayMyTeams(teams, userId) {
    const container = document.getElementById('myTeamsList');
    
    if (teams.length === 0) {
        container.innerHTML = '<div class="empty-state">No teams yet. Create your first team above!</div>';
        return;
    }

    container.innerHTML = '';

    teams.forEach(team => {
        const acceptedMembers = team.members.filter(m => m.status === 'accepted');
        const isLeader = team.leader._id === userId;

        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <div class="team-header">
                <h3>${team.teamName}</h3>
                ${isLeader ? '<span class="leader-badge">Leader</span>' : ''}
            </div>
            <div class="team-body">
                <p class="description">${team.description || 'No description'}</p>
                <p class="members">👥 ${acceptedMembers.length} / ${team.maxMembers} members</p>
                <p class="domains">🎯 ${team.domains.join(', ') || 'No domains specified'}</p>
                <div class="team-actions">
                    <button class="btn btn-secondary" onclick="viewTeamMembers('${team._id}')">View Members</button>
                    ${isLeader ? `<button class="btn btn-secondary" onclick="inviteToTeam('${team._id}')">Invite Members</button>` : ''}
                    ${team.conversation ? `<button class="btn btn-primary" onclick="openTeamChat('${team.conversation._id || team.conversation}', '${team.teamName}')">Chat</button>` : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load teammate recommendations
async function loadRecommendations(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/profile/recommendations/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayRecommendations(users);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Display recommendations
function displayRecommendations(users) {
    const container = document.getElementById('recommendationsList');
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state">No teammates available</div>';
        return;
    }

    container.innerHTML = '';

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-header">
                <img src="${user.profilePicture ? 'http://localhost:5000/' + user.profilePicture : 'https://via.placeholder.com/80?text=' + user.name.substring(0, 1)}" 
                     alt="${user.name}" class="user-avatar">
            </div>
            <div class="user-body">
                <h4>${user.name}</h4>
                <p class="location">📍 ${user.state || 'Location not specified'}</p>
                <p class="experience">Level: ${user.experience}</p>
                <p class="skills"><strong>Skills:</strong> ${user.skills.slice(0, 3).join(', ') || 'No skills listed'}</p>
                <p class="domains"><strong>Domains:</strong> ${user.domains.slice(0, 2).join(', ') || 'No domains listed'}</p>
                <div class="user-actions">
                    <button class="btn btn-primary" onclick="connectWithUser('${user._id}', '${user.name}')">Connect</button>
                    <button class="btn btn-secondary" onclick="viewProfile('${user._id}')">View Profile</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter recommendations by domain
document.getElementById('domainFilter').addEventListener('change', (e) => {
    const domain = e.target.value;
    filterRecommendations(domain);
});

function filterRecommendations(domain) {
    // Would filter based on domain - for now we load all
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;
    
    if (domain) {
        // Could add domain query parameter to API call
    }
    loadRecommendations(userId);
}

// Connect with user (invite to team or start 1:1 chat)
async function connectWithUser(userId, userName) {
    const token = currentToken;
    const currentUserIdLocal = currentUserId;

    // create or get 1:1 conversation then open chat modal
    try {
        const res = await fetch(`${API_BASE_URL}/chat/conversation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userIds: [currentUserIdLocal, userId] })
        });
        const conv = await res.json();
        if (res.ok) {
            showChatModal(conv._id || conv, userName);
        } else {
            showMessage('Failed to start chat', 'error', 'globalMessage');
        }
    } catch (err) {
        console.error('connect error', err);
        showMessage('Error creating conversation', 'error', 'globalMessage');
    }
}

// View profile
function viewProfile(userId) {
    // Could open a modal with user profile details
    alert('Profile modal would open here');
}

// Open chat modal helper
function openTeamChat(conversationId, name) {
    showChatModal(conversationId, name);
}

// View team members
function viewTeamMembers(teamId) {
    alert('Team members modal would open here');
}

// Invite to team by email
async function inviteToTeam(teamId) {
    const email = prompt('Enter email of person to invite:');
    if (!email) return;
    try {
        const res1 = await fetch(`${API_BASE_URL}/users/search?email=${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (!res1.ok) {
            const d = await res1.json();
            throw new Error(d.message || 'User not found');
        }
        const user = await res1.json();
        const res2 = await fetch(`${API_BASE_URL}/teams/${teamId}/invite/${user._id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const data = await res2.json();
        if (!res2.ok) {
            showMessage(data.message || 'Invite failed', 'error', 'globalMessage');
        } else {
            showMessage('Invite sent!', 'success', 'globalMessage');
            loadMyTeams(currentUserId);
        }
    } catch (err) {
        console.error('invite error', err);
        showMessage(err.message || 'Error sending invite', 'error', 'globalMessage');
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
function showMessage(text, type, elementId = 'globalMessage') {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// --------- Pending invites logic ---------
async function loadPendingInvites(userId) {
    try {
        const res = await fetch(`${API_BASE_URL}/teams/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (!res.ok) return;
        const teams = await res.json();
        const invites = [];
        teams.forEach(t => {
            t.members.forEach(m => {
                if (m.userId._id === userId && m.status === 'invited') {
                    invites.push({ team: t, membership: m });
                }
            });
        });
        displayInvites(invites);
    } catch (err) {
        console.error('Error loading invites', err);
    }
}

function displayInvites(invites) {
    const container = document.getElementById('invitesList');
    if (invites.length === 0) {
        container.innerHTML = '<div class="empty-state">No pending invites</div>';
        return;
    }
    container.innerHTML = '';
    invites.forEach(inv => {
        const card = document.createElement('div');
        card.className = 'invite-card';
        card.innerHTML = `
            <div class="invite-info">
                <strong>${inv.team.teamName}</strong> (Leader: ${inv.team.leader.name})
            </div>
            <div class="invite-actions">
                <button class="btn btn-primary" onclick="respondInvite('${inv.team._id}','${currentUserId}',true)">Accept</button>
                <button class="btn btn-secondary" onclick="respondInvite('${inv.team._id}','${currentUserId}',false)">Reject</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function respondInvite(teamId, userId, accept) {
    const endpoint = accept ? 'accept' : 'reject';
    try {
        const res = await fetch(`${API_BASE_URL}/teams/${teamId}/${endpoint}/${userId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (!res.ok) {
            showMessage(data.message || 'Action failed', 'error', 'globalMessage');
        } else {
            showMessage(data.message, 'success', 'globalMessage');
            loadPendingInvites(currentUserId);
            loadMyTeams(currentUserId);
        }
    } catch (err) {
        console.error('respond invite error', err);
        showMessage('Error processing invite', 'error', 'globalMessage');
    }
}

// --------- Chat modal logic ---------
async function showChatModal(conversationId, name) {
    chatConvId = conversationId;
    document.getElementById('chatModalTitle').textContent = name;
    document.getElementById('chatModal').classList.remove('hidden');
    // mark messages as seen before loading
    localStorage.setItem('lastSeen', new Date().toISOString());
    fetchChatMessages();
    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(fetchChatMessages, 5000);
}

document.getElementById('chatClose').addEventListener('click', () => {
    document.getElementById('chatModal').classList.add('hidden');
    if (chatPollInterval) clearInterval(chatPollInterval);
});

document.getElementById('chatMessageForm').addEventListener('submit', sendChatMessage);

async function fetchChatMessages() {
    if (!chatConvId) return;
    try {
        const res = await fetch(`${API_BASE_URL}/chat/conversation/${chatConvId}/messages`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
            const msgs = await res.json();
            renderChatMessages(msgs);
        }
    } catch (err) {
        console.error('fetch chat messages', err);
    }
}

function renderChatMessages(messages) {
    const container = document.getElementById('chatMessagesContainer');
    container.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message ' + (msg.sender._id === currentUserId ? 'self' : 'other');
        div.innerHTML = `<span class="text">${msg.text || ''}</span>`;
        if (msg.attachments && msg.attachments.length) {
            const aDiv = document.createElement('div');
            aDiv.className = 'attachments';
            msg.attachments.forEach(att => {
                const img = document.createElement('img');
                img.src = `http://localhost:5000/${att}`;
                aDiv.appendChild(img);
            });
            div.appendChild(aDiv);
        }
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage(e) {
    e.preventDefault();
    const text = document.getElementById('chatMessageInput').value;
    const files = document.getElementById('chatAttachmentInput').files;
    const form = new FormData();
    form.append('conversationId', chatConvId);
    form.append('senderId', currentUserId);
    form.append('text', text);
    for (let i = 0; i < files.length; i++) form.append('attachments', files[i]);

    try {
        const res = await fetch(`${API_BASE_URL}/chat/message`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${currentToken}` },
            body: form
        });
        if (res.ok) {
            document.getElementById('chatMessageInput').value = '';
            document.getElementById('chatAttachmentInput').value = '';
            fetchChatMessages();
        }
    } catch (err) {
        console.error('send chat error', err);
    }
}

// --------- Notifications ---------
async function loadNotifications() {
    let count = 0;
    try {
        // pending invites
        const res = await fetch(`${API_BASE_URL}/teams/user/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
            const teams = await res.json();
            teams.forEach(t => {
                t.members.forEach(m => {
                    if (m.userId._id === currentUserId && m.status === 'invited') count++;
                });
            });
        }
        // unread messages
        const lastSeen = localStorage.getItem('lastSeen') || 0;
        const convRes = await fetch(`${API_BASE_URL}/chat/conversations/user/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (convRes.ok) {
            const convs = await convRes.json();
            for (const c of convs) {
                const msgRes = await fetch(`${API_BASE_URL}/chat/conversation/${c._id}/messages`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (msgRes.ok) {
                    const msgs = await msgRes.json();
                    msgs.forEach(m => {
                        if (new Date(m.createdAt) > new Date(lastSeen) && m.sender._id !== currentUserId) count++;
                    });
                }
            }
        }
    } catch (e) {
        console.warn('notification error', e);
    }
    let btn = document.querySelector('.notif-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'notif-btn';
        btn.addEventListener('click', () => {
            localStorage.setItem('lastSeen', new Date().toISOString());
            window.location.href = '../team/team.html';
        });
        document.body.appendChild(btn);
    }
    btn.textContent = count || '';
}
