//const BACKEND = 'http://localhost:5000'; // Change to your Render backend URL later
const BACKEND = 'https://vpn-67qs.onrender.com'; // Live backend URL

if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'index.html';
}

let currentUser = '';

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

async function createUser() {
  const username = document.getElementById('vpn-username').value.trim();
  if (!username) return alert("Username is required");

  const res = await fetch(`${BACKEND}/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });

  const data = await res.json();

  if (res.ok) {
    alert('✅ User created!');
    fetchUsers();
  } else {
    alert(data.error || 'Something went wrong');
  }
}

async function fetchUsers() {
  const res = await fetch(`${BACKEND}/users`);
  const users = await res.json();
  const list = document.getElementById('user-list');
  list.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<button onclick="selectUser('${user}')">${user}</button>`;
    list.appendChild(li);
  });
}

function selectUser(username) {
  currentUser = username;
  document.getElementById('selected-user').innerText = username;
  document.getElementById('user-actions').style.display = 'block';
  document.getElementById('result').innerHTML = '';
}

async function showQR() {
  if (!currentUser) return;

  const res = await fetch(`${BACKEND}/get-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('result').innerHTML = `
      <h4>QR Code for ${currentUser}</h4>
      <img src="${BACKEND}${data.qr}" width="200">
    `;
  } else {
    alert(data.error || 'QR not found');
  }
}

async function downloadConfig() {
  if (!currentUser) return;

  const filename = `${currentUser}.conf`;
  const link = document.createElement('a');
  link.href = `${BACKEND}/conf/${filename}`;
  link.download = filename; // Forces browser download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



async function deleteUser() {
  if (!currentUser) return;

  const res = await fetch(`${BACKEND}/delete-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser })
  });

  const data = await res.json();
  alert(data.message || data.error);
  currentUser = '';
  document.getElementById('user-actions').style.display = 'none';
  fetchUsers();
}
async function deleteAllUsers() {
  if (!confirm("Are you sure you want to delete ALL VPN users? This cannot be undone.")) return;

  const res = await fetch(`${BACKEND}/delete-all-users`, {
    method: 'DELETE'
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.message || 'All users deleted');
    document.getElementById('result').innerHTML = '';
  } else {
    alert(data.error || 'Failed to delete all users');
  }
}


window.onload = fetchUsers;
