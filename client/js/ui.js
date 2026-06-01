// UI Logic
let isRegistering = false;

// Toggle between Login and Register
document.getElementById('toggleRegister').addEventListener('click', () => {
    isRegistering = !isRegistering;
    const btn = document.getElementById('toggleRegister');
    const loginBtn = document.getElementById('loginBtn');
    btn.textContent = isRegistering ? 'GO TO LOGIN' : 'CREATE ACCOUNT';
    loginBtn.textContent = isRegistering ? 'REGISTER' : 'LOGIN';
});

// Handle Auth Form Submission
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (isRegistering) {
                alert('Account created! Now login.');
                isRegistering = false;
                document.getElementById('toggleRegister').click();
            } else {
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                initializeGame(data.user);
            }
        } else {
            alert(data.error || 'Error');
        }
    } catch (err) {
        alert('Connection error: ' + err.message);
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    location.reload();
});

// Admin Panel
document.getElementById('adminBtn').addEventListener('click', () => {
    if (currentUser.isOwner || currentUser.isAdmin) {
        console.log('Admin panel opened');
        // TODO: Create admin panel UI
    } else {
        alert('You are not an admin');
    }
});

// Shop
document.getElementById('shopBtn').addEventListener('click', () => {
    console.log('Shop opened');
    // TODO: Create shop UI
});

// Index
document.getElementById('indexBtn').addEventListener('click', () => {
    console.log('Index opened');
    // TODO: Create index/encyclopedia UI
});
