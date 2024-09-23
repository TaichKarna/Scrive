
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
cd server
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
cd server
npm start
```

#### Frontend (React)

```bash
cd client
npm start
```

By default, the backend will be running on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User registration.

### Posts

- `GET /api/posts`: Get all posts.
- `POST /api/posts`: Create a new post (Authenticated).
- `PUT /api/posts/:id`: Edit a post (Authenticated).
- `DELETE /api/posts/:id`: Delete a post (Authenticated).

### Admin

- `GET /api/admin/users`: Get all users (Admin only).
- `GET /api/admin/posts`: Get post statistics (Admin only).

## Admin Panel

To access the admin panel, you need to log in with an admin account. The admin panel allows monitoring:

- Total number of users.
- Post views, likes, and other metrics.

## License

This project is licensed under the MIT License.
```

You can adjust the repository URL and other details as needed. Let me know if you need any further customization!
