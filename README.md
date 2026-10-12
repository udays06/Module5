# Secure Blog Application with JWT Authentication

Node.js + Express.js + MongoDB application with secure JWT authentication, protected dashboard, user profile, logout, and full blog CRUD.

## Features

- Secure JWT-based authentication
- Passwords hashed with bcrypt
- Protected dashboard route
- Dashboard displays only the logged-in user's blogs
- User profile view and update
- Logout functionality
- Create, read, update, and delete blogs
- Search blogs and filter by category
- Only blog authors can update or delete their own blogs

## Setup

```bash
cd blog-app/backend
npm install
npm start
```

Configure `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Open `blog-app/frontend/index.html` in your browser.

## Protected Routes

These routes require this header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/blogs/my/blogs`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get logged-in user profile |
| PUT | `/api/auth/me` | Yes | Update profile |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/blogs` | No | Get/search/filter blogs |
| GET | `/api/blogs/my/blogs` | Yes | Get only current user's blogs |
| GET | `/api/blogs/:id` | No | Get one blog |
| POST | `/api/blogs` | Yes | Create blog |
| PUT | `/api/blogs/:id` | Yes | Update blog; author only |
| DELETE | `/api/blogs/:id` | Yes | Delete blog; author only |

## Security Notes

- JWT is stored in browser `localStorage` for this learning project.
- For higher-security production apps, prefer short-lived access tokens plus secure HTTP-only refresh-token cookies.
- Never commit `.env`, JWT secrets, or database credentials to GitHub.
