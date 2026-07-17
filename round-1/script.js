const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login form submitted!');
});

const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Signup form submitted!');
});