const fs = require('fs');
const path = require('path');

function getLineEnding(content) {
    return content.includes('\r\n') ? '\r\n' : '\n';
}

function replaceLines(filepath, ranges, replacementText) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        return;
    }
    let content = fs.readFileSync(filepath, 'utf8');
    const separator = getLineEnding(content);
    let lines = content.split(separator);
    
    let sortedRanges = ranges.sort((a, b) => b[0] - a[0]);
    
    for (let r of sortedRanges) {
        let start = r[0] - 1;
        let end = r[1] - 1;
        let count = end - start + 1;
        console.log(`Replacing lines ${r[0]}-${r[1]} in ${filepath}`);
        lines.splice(start, count, replacementText);
    }
    
    fs.writeFileSync(filepath, lines.join(separator), 'utf8');
    console.log(`Updated ${filepath}`);
}

function appendToFile(filepath, textToAppend) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    const separator = getLineEnding(content);
    fs.writeFileSync(filepath, content + separator + textToAppend, 'utf8');
    console.log(`Appended to ${filepath}`);
}

const baseDir = 'c:\\Users\\Preetham.j\\Desktop\\My-Stufs\\startup-proj\\sup-frontend\\team';

const messageHudHtml = `    <!-- Message HUD -->
    <div class="message-hud">
        <div class="message-indicator">
            <span class="message-icon">⋯</span>
            <span class="message-count" id="teamMsgCount">0</span>
        </div>
        <div class="message-dropdown" id="teamMessageDropdown">
            <div class="message-header">
                <span class="message-title">🔔 Notifications</span>
                <button class="close-btn" id="teamCloseBtn">&times;</button>
            </div>
            <div class="message-list" id="teamMessageList">
                <p class="no-messages">No new notifications</p>
            </div>
        </div>
    </div>`;

replaceLines(path.join(baseDir, 'team.html'), [[19, 19]], messageHudHtml);
replaceLines(path.join(baseDir, 'team.css'), [[513, 530]], "");

const messageHudCss = `
/* Message HUD */
.message-hud {
    position: fixed;
    bottom: 25vh;
    right: 2rem;
    z-index: 900;
    font-family: 'Poppins', sans-serif;
}
.message-indicator {
    background: linear-gradient(135deg, #ff8a00, #e52e71);
    border-radius: 50px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(229, 46, 113, 0.4);
    transition: all 0.3s ease;
    position: relative;
    animation: blink 2s infinite;
}
@keyframes blink {
    0%, 100% { box-shadow: 0 8px 32px rgba(229, 46, 113, 0.4); }
    50% { box-shadow: 0 8px 32px rgba(255, 138, 0, 0.8); }
}
.message-indicator:hover { transform: scale(1.1); }
.message-icon { font-size: 1.5rem; color: white; position: absolute; }
.message-count { position: absolute; top: -5px; right: -5px; background: #ffd700; color: #222; border-radius: 50%; width: 28px; height: 28px; display: none; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5); }
.message-dropdown { position: absolute; bottom: 80px; right: 0; background: rgba(15, 15, 30, 0.98); border: 1px solid rgba(255, 138, 0, 0.3); border-radius: 15px; width: 320px; max-height: 400px; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; box-shadow: 0 20px 60px rgba(229, 46, 113, 0.2); backdrop-filter: blur(10px); }
.message-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
.message-header { padding: 1rem; border-bottom: 1px solid rgba(255, 138, 0, 0.2); display: flex; justify-content: space-between; align-items: center; }
.message-title { font-weight: 700; color: rgba(255, 138, 0, 0.9); font-size: 0.95rem; }
.close-btn { background: none; border: none; color: rgba(255, 255, 255, 0.5); font-size: 1.5rem; cursor: pointer; transition: color 0.3s ease; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.close-btn:hover { color: rgba(255, 255, 255, 0.9); }
.message-list { overflow-y: auto; flex: 1; max-height: 320px; padding: 0.5rem; }
.no-messages { text-align: center; color: rgba(255, 255, 255, 0.5); padding: 2rem 1rem; font-size: 0.9rem; }
.message-item { padding: 0.75rem; margin: 0.25rem 0; border-radius: 8px; display: flex; gap: 0.75rem; align-items: flex-start; background: rgba(255, 138, 0, 0.05); border-left: 3px solid transparent; transition: all 0.2s ease; cursor: pointer; }
.message-item:hover { background: rgba(255, 138, 0, 0.1); border-left-color: #ff8a00; }
.message-item.unread { background: rgba(255, 138, 0, 0.15); border-left-color: #ff8a00; }
.msg-avatar { font-size: 1.2rem; flex-shrink: 0; }
.msg-content { flex: 1; min-width: 0; }
.msg-sender { font-weight: 600; color: rgba(255, 138, 0, 0.9); font-size: 0.85rem; }
.msg-text { color: rgba(255, 255, 255, 0.7); font-size: 0.8rem; margin-top: 0.25rem; word-break: break-word; }
`;

appendToFile(path.join(baseDir, 'team.css'), messageHudCss);

const listenersCode = `    const indicator = document.querySelector('.message-indicator');
    const dropdown = document.getElementById('teamMessageDropdown');
    const closeBtn = document.getElementById('teamCloseBtn');
    if (indicator && dropdown) {
        indicator.addEventListener('click', () => dropdown.classList.toggle('active'));
        if (closeBtn) closeBtn.addEventListener('click', () => dropdown.classList.remove('active'));
    }
    document.addEventListener('click', (e) => {
        if (dropdown && !e.target.closest('.message-hud')) dropdown.classList.remove('active');
    });
    loadNotifications();`;

replaceLines(path.join(baseDir, 'team.js'), [[24, 24]], listenersCode);

// Use single quotes and string concatenation to avoid template string collision
const loadNotificationsCode = 'async function loadNotifications() {\n' +
'    let count = 0;\n' +
'    let notifs = [];\n' +
'    try {\n' +
'        const res = await fetch(`${API_BASE_URL}/teams/user/${currentUserId}`, {\n' +
'            headers: { "Authorization": `Bearer ${currentToken}` }\n' +
'        });\n' +
'        if (res.ok) {\n' +
'            const teams = await res.json();\n' +
'            teams.forEach(t => {\n' +
'                t.members.forEach(m => {\n' +
'                    if (m.userId._id === currentUserId && m.status === "invited") {\n' +
'                        count++;\n' +
'                        notifs.push({ sender: t.leader.name, text: `Invited to: ${t.teamName}` });\n' +
'                    }\n' +
'                });\n' +
'            });\n' +
'        }\n' +
'    } catch (e) { console.warn("notification error", e); }\n' +
'    \n' +
'    const countElem = document.getElementById("teamMsgCount");\n' +
'    const listElem = document.getElementById("teamMessageList");\n' +
'    if (countElem) {\n' +
'        countElem.textContent = count;\n' +
'        countElem.style.display = count > 0 ? "flex" : "none";\n' +
'    }\n' +
'    if (listElem) {\n' +
'        if (notifs.length === 0) listElem.innerHTML = \'<p class="no-messages">No invites</p>\';\n' +
'        else listElem.innerHTML = notifs.map(n => `<div class="message-item unread"><span class="msg-avatar">🔔</span><div class="msg-content"><div class="msg-sender">${n.sender}</div><div class="msg-text">${n.text}</div></div></div>`).join("");\n' +
'    }\n' +
'}';

replaceLines(path.join(baseDir, 'team.js'), [[445, 493]], loadNotificationsCode);
appendToFile(path.join(baseDir, 'team.js'), '\nsetInterval(loadNotifications, 5000);\n');
