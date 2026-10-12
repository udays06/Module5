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

async function registerUser() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    showMessage("Registration successful. Redirecting to dashboard...");
    setTimeout(() => window.location.href = "dashboard.html", 1000);
  } else {
    showMessage(data.message, true);
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    showMessage("Login successful. Redirecting to dashboard...");
    setTimeout(() => window.location.href = "dashboard.html", 1000);
  } else {
    showMessage(data.message, true);
  }
}

async function getBlogs() {
  const search = document.getElementById("searchInput").value.trim();
  const category = document.getElementById("categoryFilter").value;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);

  const response = await fetch(`${API_URL}/blogs?${params.toString()}`);
  const data = await response.json();

  const blogsContainer = document.getElementById("blogs");
  blogsContainer.innerHTML = "";

  if (!response.ok) {
    showMessage(data.message, true);
    return;
  }

  if (data.blogs.length === 0) {
    blogsContainer.innerHTML = "<p>No blogs found.</p>";
    return;
  }

  data.blogs.forEach((blog) => {
    const blogElement = document.createElement("div");
    blogElement.className = "blog";
    blogElement.innerHTML = `
      <h3><a href="blog.html?id=${blog._id}">${blog.title}</a></h3>
      <span class="category">${blog.category}</span>
      <p>${blog.content.substring(0, 140)}...</p>
      <small>By ${blog.author?.name || "Unknown"} • ${new Date(blog.createdAt).toLocaleString()}</small>
    `;
    blogsContainer.appendChild(blogElement);
  });
}

getBlogs();
