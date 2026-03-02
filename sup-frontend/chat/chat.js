const API_BASE_URL = 'http://localhost:5000/api';
let conversationId;
let myUserId;

function parseQuery() {
    const params = new URLSearchParams(window.location.search);
    return {
        conversationId: params.get('conversationId'),
        name: params.get('name')
    };
}

async function fetchMessages() {
    if (!conversationId) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const messages = await response.json();
            displayMessages(messages);
        }
    } catch (err) {
        console.error('Fetch messages error', err);
    }
}

function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message ' + (msg.sender._id === myUserId ? 'self' : 'other');
        div.innerHTML = `<span class="text">${msg.text || ''}</span>`;
        if (msg.attachments && msg.attachments.length) {
            const aDiv = document.createElement('div');
            aDiv.className = 'attachments';
            msg.attachments.forEach(att => {
                // assume images for now
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

async function sendMessage(e) {
    e.preventDefault();
    const text = document.getElementById('messageInput').value;
    const files = document.getElementById('attachmentInput').files;

    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('conversationId', conversationId);
    form.append('senderId', myUserId);
    form.append('text', text);
    for (let i = 0; i < files.length; i++) {
        form.append('attachments', files[i]);
    }

    const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
    });
    if (res.ok) {
        document.getElementById('messageInput').value = '';
        document.getElementById('attachmentInput').value = '';
        fetchMessages();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const query = parseQuery();
    conversationId = query.conversationId;
    if (query.name) {
        document.getElementById('chatTitle').textContent = decodeURIComponent(query.name);
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    myUserId = user._id || user.id;
    if (!conversationId || !myUserId) {
        alert('Missing conversation or not logged in');
        window.location.href = '../auth/login.html';
        return;
    }

    fetchMessages();
    setInterval(fetchMessages, 5000);

    document.getElementById('messageForm').addEventListener('submit', sendMessage);
});