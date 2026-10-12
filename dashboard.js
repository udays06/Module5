const API_URL = "http://localhost:5000/api";
let editingBlogId = null;

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
    showMessage("Please login to access your dashboard", true);
    setTimeout(() => window.location.href = "index.html", 1200);
    return false;
  }
  return true;
}

function resetBlogForm() {
  editingBlogId = null;
  document.getElementById("formTitle").textContent = "Create Blog";
  document.getElementById("submitBlogButton").textContent = "Create Blog";
  document.getElementById("cancelEditButton").style.display = "none";
  document.getElementById("blogTitle").value = "";
  document.getElementById("blogCategory").value = "";
  document.getElementById("blogContent").value = "";
}

function startEdit(blog) {
  editingBlogId = blog._id;
  document.getElementById("formTitle").textContent = "Update Blog";
  document.getElementById("submitBlogButton").textContent = "Update Blog";
  document.getElementById("cancelEditButton").style.display = "inline-block";
  document.getElementById("blogTitle").value = blog.title;
  document.getElementById("blogCategory").value = blog.category;
  document.getElementById("blogContent").value = blog.content;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  resetBlogForm();
  showMessage("Edit cancelled");
}

async function submitBlog() {
  if (!requireLogin()) return;

  const title = document.getElementById("blogTitle").value;
  const category = document.getElementById("blogCategory").value || "General";
  const content = document.getElementById("blogContent").value;

  const url = editingBlogId
    ? `${API_URL}/blogs/${editingBlogId}`
    : `${API_URL}/blogs`;

  const response = await fetch(url, {
    method: editingBlogId ? "PUT" : "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, category, content })
  });

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("token");
    showMessage("Session expired. Please login again.", true);
    setTimeout(() => window.location.href = "index.html", 1200);
    return;
  }

  if (response.ok) {
    showMessage(data.message);
    resetBlogForm();
    getMyBlogs();
  } else {
    showMessage(data.message, true);
  }
}

async function deleteBlog(blogId) {
  if (!requireLogin()) return;

  if (!confirm("Are you sure you want to delete this blog?")) return;

  const response = await fetch(`${API_URL}/blogs/${blogId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

  const data = await response.json();

  if (response.ok) {
    showMessage(data.message);
    getMyBlogs();
  } else {
    showMessage(data.message, true);
  }
}

async function getMyBlogs() {
  if (!requireLogin()) return;

  const response = await fetch(`${API_URL}/blogs/my/blogs`, {
    headers: authHeaders()
  });

  const data = await response.json();

  const container = document.getElementById("myBlogs");
  container.innerHTML = "";

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

  if (data.blogs.length === 0) {
    container.innerHTML = "<p>You have not created any blogs yet.</p>";
    return;
  }

  data.blogs.forEach((blog) => {
    const blogElement = document.createElement("div");
    blogElement.className = "blog";
    blogElement.innerHTML = `
      <h3><a href="blog.html?id=${blog._id}">${blog.title}</a></h3>
      <span class="category">${blog.category}</span>
      <p>${blog.content.substring(0, 140)}...</p>
      <small>${new Date(blog.createdAt).toLocaleString()}</small>
      <br />
      <button onclick='startEdit(${JSON.stringify(blog)})'>Edit</button>
      <button class="danger" onclick="deleteBlog('${blog._id}')">Delete</button>
    `;
    container.appendChild(blogElement);
  });
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

if (requireLogin()) {
  getMyBlogs();
}
