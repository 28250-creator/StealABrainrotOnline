// UI Logic - Browser Only Version
let isRegistering = false;
let users = JSON.parse(localStorage.getItem('gameUsers') || '{}');

// Toggle between Login and Register
document.getElementById('toggleRegister').addEventListener('click', () => {
    isRegistering = !isRegistering;
    const btn = document.getElementById('toggleRegister');
    const loginBtn = document.getElementById('loginBtn');
    btn.textContent = isRegistering ? 'GO TO LOGIN' : 'CREATE ACCOUNT';
    loginBtn.textContent = isRegistering ? 'REGISTER' : 'LOGIN';
});

// Handle Auth Form Submission
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (isRegistering) {
        // Register
        if (users[username]) {
            alert('❌ Username already exists!');
            return;
        }
        
        users[username] = {
            username: username,
            password: password,
            money: 100,
            slots: 1,
            rebirths: 0,
            brainrots: [],
            isAdmin: false,
            isOwner: false
        };
        
        localStorage.setItem('gameUsers', JSON.stringify(users));
        alert('✅ Account created! Now login.');
        isRegistering = false;
        document.getElementById('toggleRegister').click();
        document.getElementById('authForm').reset();
        
    } else {
        // Login
        if (!users[username]) {
            alert('❌ User not found!');
            return;
        }
        
        if (users[username].password !== password) {
            alert('❌ Wrong password!');
            return;
        }
        
        // Login success
        currentUser = users[username];
        localStorage.setItem('currentUser', username);
        initializeGame(currentUser);
    }
});

// Shop
document.getElementById('shopBtn').addEventListener('click', () => {
    alert('🛒 Shop coming soon!');
});

// Index
document.getElementById('indexBtn').addEventListener('click', () => {
    alert('📖 Index coming soon!');
});

// Admin Panel
document.getElementById('adminBtn').addEventListener('click', () => {
    if (currentUser.isOwner || currentUser.isAdmin) {
        alert('⚙️ Admin panel coming soon!');
    } else {
        alert('❌ You are not an admin');
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    location.reload();
});

// Auto-login if user was logged in
window.addEventListener('load', () => {
    const lastUser = localStorage.getItem('currentUser');
    if (lastUser && users[lastUser]) {
        currentUser = users[lastUser];
        initializeGame(currentUser);
    }
});