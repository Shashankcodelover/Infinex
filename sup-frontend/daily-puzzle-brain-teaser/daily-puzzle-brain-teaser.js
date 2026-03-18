// ====================================
// Daily Puzzle Brain Teaser Logic
// ====================================

const API_BASE_URL = 'http://localhost:5000/api';
let currentPuzzle = null;
let userStats = null;

// Load puzzle and stats on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }
    loadDailyPuzzle();
    loadUserStats();
});

// Load today's puzzle
async function loadDailyPuzzle() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/daily-puzzle/today`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const puzzle = await response.json();
            currentPuzzle = puzzle;
            displayPuzzle(puzzle);
        } else {
            showEmptyState('Failed to load today\'s puzzle');
        }
    } catch (error) {
        console.error('Error loading puzzle:', error);
        // Show placeholder puzzle for development
        showPlaceholderPuzzle();
    }
}

// Load user puzzle statistics
async function loadUserStats() {
    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;
        const response = await fetch(`${API_BASE_URL}/daily-puzzle/streak/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            userStats = await response.json();
            updateStatsDisplay(userStats);
        } else {
            // Use placeholder stats for development
            updateStatsDisplay({
                totalSolved: 0,
                currentStreak: 0,
                bestStreak: 0
            });
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        updateStatsDisplay({
            totalSolved: 0,
            currentStreak: 0,
            bestStreak: 0
        });
    }
}

// Display puzzle on the page
function displayPuzzle(puzzle) {
    const container = document.getElementById('puzzleContainer');
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isSolved = puzzle.solved || false;

    container.innerHTML = `
        <div class="puzzle-card">
            <div class="puzzle-header">
                <div class="puzzle-title">${escapeHtml(puzzle.title || 'Daily Challenge')}</div>
                <div class="puzzle-date">${today}</div>
            </div>
            <div class="puzzle-content">
                <div class="puzzle-question">${escapeHtml(puzzle.question || puzzle.description || 'What comes next in the sequence: 2, 6, 12, 20, ...?')}</div>
                ${puzzle.hint ? `<div class="puzzle-hint">💡 Hint: ${escapeHtml(puzzle.hint)}</div>` : ''}
            </div>
            <div class="answer-section">
                <input 
                    type="text" 
                    id="answerInput" 
                    class="answer-input" 
                    placeholder="Type your answer here..."
                    ${isSolved ? 'disabled' : ''}
                >
                <button 
                    class="btn btn-primary" 
                    id="submitBtn"
                    onclick="submitAnswer()"
                    ${isSolved ? 'disabled' : ''}
                >
                    ${isSolved ? 'Already Solved ✓' : 'Submit Answer'}
                </button>
            </div>
            <div id="resultMessage" class="result-message"></div>
            ${isSolved ? '<div class="result-message already-solved">You\'ve already solved today\'s puzzle! Come back tomorrow for a new challenge.</div>' : ''}
        </div>
    `;
}

// Show placeholder puzzle for development
function showPlaceholderPuzzle() {
    const placeholderPuzzle = {
        id: 'placeholder-1',
        title: 'Number Sequence Challenge',
        question: 'What number comes next in this sequence?\n\n2, 6, 12, 20, 30, ___',
        hint: 'Look at the differences between consecutive numbers.',
        answer: '42',
        solved: false
    };
    currentPuzzle = placeholderPuzzle;
    displayPuzzle(placeholderPuzzle);
}

// Submit answer
async function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultMessage = document.getElementById('resultMessage');

    const answer = answerInput.value.trim();

    if (!answer) {
        showResult('Please enter an answer', 'wrong');
        return;
    }

    // Disable input while checking
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';

    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;
        const response = await fetch(`${API_BASE_URL}/daily-puzzle/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                puzzleId: currentPuzzle._id,
                answer: answer
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.correct) {
                showResult('🎉 Correct! Great job!', 'correct');
                answerInput.disabled = true;
                submitBtn.textContent = 'Solved ✓';
                // Refresh stats to update streak
                loadUserStats();
            } else {
                showResult('❌ Incorrect. Try again!', 'wrong');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Answer';
            }
        } else {
            // For development, check against placeholder answer
            if (answer.toLowerCase() === (currentPuzzle.answer || '').toLowerCase()) {
                showResult('🎉 Correct! Great job! (Development Mode)', 'correct');
                answerInput.disabled = true;
                submitBtn.textContent = 'Solved ✓';
                // Simulate streak increment
                const currentStreak = parseInt(document.getElementById('statCurrentStreak').textContent);
                updateStatsDisplay({
                    totalSolved: parseInt(document.getElementById('statTotalSolved').textContent) + 1,
                    currentStreak: currentStreak + 1,
                    bestStreak: Math.max(parseInt(document.getElementById('statBestStreak').textContent), currentStreak + 1)
                });
            } else {
                showResult('❌ Incorrect. Try again! (Development Mode)', 'wrong');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Answer';
            }
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        // Development fallback
        if (answer.toLowerCase() === (currentPuzzle.answer || '').toLowerCase()) {
            showResult('🎉 Correct! Great job! (Development Mode)', 'correct');
            answerInput.disabled = true;
            submitBtn.textContent = 'Solved ✓';
        } else {
            showResult('❌ Incorrect. Try again!', 'wrong');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Answer';
        }
    }
}

// Show result message
function showResult(message, type) {
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${type}`;
}

// Update stats display
function updateStatsDisplay(stats) {
    document.getElementById('statTotalSolved').textContent = stats.totalSolved || 0;
    document.getElementById('statCurrentStreak').textContent = stats.currentStreak || 0;
    document.getElementById('statBestStreak').textContent = stats.bestStreak || 0;

    // Update streak counter text
    const streak = stats.currentStreak || 0;
    const streakText = document.getElementById('streakText');
    if (streak === 1) {
        streakText.textContent = '1 day streak';
    } else {
        streakText.textContent = `${streak} day streak`;
    }
}

// Show empty state
function showEmptyState(message) {
    const container = document.getElementById('puzzleContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🧩</div>
            <h2>No Puzzle Available</h2>
            <p>${escapeHtml(message || 'Check back later for today\'s challenge!')}</p>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
});

// Allow Enter key to submit
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.id === 'answerInput') {
        submitAnswer();
    }
});
