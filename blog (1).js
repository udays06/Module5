const API_URL = "http://localhost:5000/api";

async function loadBlog() {
  const blogId = new URLSearchParams(window.location.search).get("id");

  if (!blogId) {
    document.getElementById("error").textContent = "Blog ID is missing.";
    return;
  }

  const response = await fetch(`${API_URL}/blogs/${blogId}`);
  const data = await response.json();

  if (!response.ok) {
    document.getElementById("error").textContent = data.message;
    document.getElementById("blogTitle").textContent = "Blog not found";
    return;
  }

  const blog = data.blog;

  document.getElementById("blogCategory").textContent = blog.category;
  document.getElementById("blogTitle").textContent = blog.title;
  document.getElementById("blogAuthor").textContent =
    `By ${blog.author?.name || "Unknown"} • ${new Date(blog.createdAt).toLocaleString()}`;
  document.getElementById("blogContent").textContent = blog.content;
}

loadBlog();
