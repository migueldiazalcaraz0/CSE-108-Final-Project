// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '/';
        return null;
    }
    
    return user;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Update user info in the UI
function updateUserInfo() {
    const user = checkAuth();
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement && user) {
        userInfoElement.innerHTML = `
            <p><strong>${user.name}</strong></p>
            <p>@${user.username}</p>
        `;
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateUserInfo();
}); 