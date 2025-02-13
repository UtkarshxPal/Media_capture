# Media Capture App

## Description
The **Media Capture App** is a full-stack web application that allows users to capture, upload, and manage media files. It features a user-friendly interface built with **React** and utilizes a **Node.js** backend for handling API requests and database interactions. The app ensures secure authentication and provides a responsive dashboard for managing uploaded media.

## Features
- **User Authentication** (Login & Registration)
- **Media Upload Functionality** (Supports images & videos)
- **Dashboard to View Uploaded Media**
- **Responsive Design** using Bootstrap
- **Secure API Endpoints** for data handling

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (for local development)

### Clone the Repository
```sh
# Clone the repository
git clone https://github.com/yourusername/media-capture-app.git
cd media-capture-app
```

### Install Dependencies

#### For the Client:
```sh
cd client
npm install
```

#### For the Server:
```sh
cd server
npm install
```

## Environment Variables
Create a `.env` file in the `server` directory and add the following variables:

```sh
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

## Usage

### Running the Application

#### Start the Server:
```sh
cd server
node index.js
```

#### Start the Client:
```sh
cd client
npm start
```

### Accessing the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## User Authentication
- **Login**: Use the login form to authenticate.
- **Register**: New users can create an account using the registration form.

## Media Management
- Once logged in, users can upload media files through the dashboard.
- Uploaded media files are stored securely and can be viewed in the dashboard.

## Contributing
Contributions are welcome! Follow these steps:
1. **Fork** the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a **pull request**.



