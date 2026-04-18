// Authentication logic using LocalStorage
const USERS_KEY = "tourguide_users";
const CURRENT_USER_KEY = "tourguide_currentUser";

function getUsers() {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
        return true;
    }
    return false;
}

function signupUser(name, email, password) {
    let users = getUsers();
    if (users.find(u => u.email === email)) {
        return false; // Email already exists
    }
    users.push({ name, email, password });
    saveUsers(users);
    // Auto login after signup
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name, email }));
    return true;
}

function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload(); 
}

function getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// Redirect if not logged in
(function checkAccess() {
    if (typeof window !== 'undefined') {
        const p = window.location.pathname;
        const isAuthPage = p.endsWith('login.html') || p.endsWith('signup.html') || p.endsWith('/login') || p.endsWith('/signup');
        const user = getCurrentUser();
        
        if (!user && !isAuthPage) {
            window.location.replace('login.html');
        } else if (user && isAuthPage) {
            window.location.replace('index.html');
        }
    }
})();
