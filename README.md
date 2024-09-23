# Blog App

This is a full-stack blog application built using Node.js, Express, React, and MongoDB, with JWT-based authentication. The app allows users to create, read, update, and delete blog posts, while the admin can monitor platform metrics such as user counts and post views.

## Features

- **User Authentication**: JWT-based authentication for secure login and session management.
- **User Functionality**:
  - Create, edit, and delete blog posts.
  - View other users' blog posts.
- **Admin Panel**:
  - Monitor the total number of users.
  - View post statistics (e.g., views, likes).
  - Manage user accounts and posts.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Previews

### User Dashboard
![User Dashboard](./previews/user-dashboard.png)

### Post Creation
![Create Post](./previews/create-post.png)

### Admin Panel - User Monitoring
![Admin Panel - User Monitoring](./previews/admin-users.png)

### Admin Panel - Post Statistics
![Admin Panel - Post Statistics](./previews/admin-post-stats.png)

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/your-username/blog-app.git
cd blog-app
```

### Install Dependencies

For the server:

```bash
cd Blog-MERN
npm install
```

For the client:

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the root of the `server` directory and add the following:

```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
```

### Running the App

#### Backend (Express API)

```bash
npm run dev
```

#### Frontend (React)

```bash
cd client
npm run dev
```

By default, the backend will be running on `http://localhost:3000` and the frontend on `http://localhost:5173`.

## API Endpoints

## API Endpoints

### Authentication

- `POST /signup`: User registration.
- `POST /signin`: User login.
- `POST /google`: Google OAuth login.
- `POST /signout`: User sign out.

### Users

- `GET /test`: Test user route.
- `PUT /update/:userId`: Update user details (Authenticated).
- `DELETE /delete/:userId`: Delete user account (Authenticated).
- `GET /getusers`: Get a list of all users (Authenticated).
- `GET /:userId`: Get details of a specific user.

### Posts

- `POST /create`: Create a new post (Authenticated).
- `GET /getposts`: Get all posts.
- `DELETE /deletepost/:postId/:userId`: Delete a post by ID (Authenticated, user-specific).
- `PUT /update-post/:postId/:userId`: Update a post by ID (Authenticated, user-specific).

### Comments

- `POST /create`: Create a comment on a post (Authenticated).
- `GET /getcomments`: Get all comments (Authenticated).
- `GET /getcomments/:postId`: Get comments for a specific post.
- `PUT /likecomment/:commentId`: Like a comment (Authenticated).
- `PUT /editcomment/:commentId`: Edit a comment (Authenticated).
- `DELETE /deletecomment/:commentId/:userId`: Delete a comment by ID (Authenticated, user-specific).

## Admin Panel

To access the admin panel, you need to log in with an admin account. The admin panel allows the admin to manage users, posts, comments, and view important platform statistics. Below are the admin-related functionalities and routes.

### Admin Features

- **Monitor Users**: Get the total number of users, view individual user details, and delete users.
- **Manage Posts**: View post statistics (views, likes), delete posts.
- **Manage Comments**: View comments on posts, delete comments.

## License

This project is licensed under the MIT License.

