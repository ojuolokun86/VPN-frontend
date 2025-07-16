const BACKEND = 'http://localhost:5000'; // Change to your Render backend URL later

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await fetch(`${BACKEND}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('login-error').innerText = data.error || 'Login failed';
  }
}
