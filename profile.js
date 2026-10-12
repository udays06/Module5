const API_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

function showMessage(text, isError = false) {
  const message = document.getElementById("message");
  message.textContent = text;
  message.style.color = isError ? "red" : "green";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

function requireLogin() {
  if (!getToken()) {
    showMessage("Please login to view your profile", true);
    setTimeout(() => window.location.href = "index.html", 1200);
    return false;
  }
  return true;
}

async function loadProfile() {
  if (!requireLogin()) return;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders()
  });

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("token");
    showMessage("Session expired. Please login again.", true);
    setTimeout(() => window.location.href = "index.html", 1200);
    return;
  }

  if (!response.ok) {
    showMessage(data.message, true);
    return;
  }

  document.getElementById("profileName").value = data.user.name;
  document.getElementById("profileEmail").value = data.user.email;
  document.getElementById("profileBio").value = data.user.bio || "";
}

async function updateProfile() {
  if (!requireLogin()) return;

  const name = document.getElementById("profileName").value;
  const bio = document.getElementById("profileBio").value;

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, bio })
  });

  const data = await response.json();

  if (response.ok) {
    showMessage(data.message);
  } else {
    showMessage(data.message, true);
  }
}

async function logout() {
  const token = getToken();

  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: authHeaders()
    });
  }

  localStorage.removeItem("token");
  window.location.href = "index.html";
}

loadProfile();
