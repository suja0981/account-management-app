# Account Management System

A simple, responsive web application for user account management built with React. This application provides user registration, authentication, and profile management functionality with a clean, modern interface.

## Features

- **User Authentication**
  - Login with email and password
  - Form validation and error handling
  - Secure password storage

- **User Registration**
  - New account creation with email verification
  - Password strength indicator
  - Real-time form validation
  - Duplicate email detection

- **Profile Management**
  - View and edit profile information
  - Update personal details (first name, last name, email)
  - Display account creation date
  - Responsive profile interface

- **Data Persistence**
  - Local storage implementation
  - User data persists across browser sessions

## Tech Stack

- React (using React 18)
- Local Storage for data persistence
- CSS3 with modern features
- Responsive design principles

## Project Structure

```
account-manager/
├── index.html          # Main HTML file
├── style.css          # Global styles
└── app.js             # React application code
```

## Getting Started

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd account-manager
   ```
3. Set up a local development server:
   - Option 1: Using Python:
     ```bash
     # If you have Python 3 installed
     python -m http.server 8000
     ```
   - Option 2: Using Node.js:
     ```bash
     # If you have Node.js installed
     npx http-server
     ```
   - Option 3: Using VS Code Live Server extension:
     - Install "Live Server" extension
     - Right-click on `index.html` and select "Open with Live Server"

4. Open your browser and navigate to:
   - For Python: `http://localhost:8000`
   - For Node.js: `http://localhost:8080`
   - For Live Server: It will open automatically

Note: A local server is required because the application uses React and modern JavaScript features.

## Features in Detail

### Login Page
- Email validation
- Password verification
- Error handling for invalid credentials
- Navigation to registration

### Registration Page
- Comprehensive form validation
- Password strength measurement
- Duplicate email checking
- Success feedback and automatic redirection

### Profile Page
- View account information
- Edit profile details
- Instant feedback on updates
- Logout functionality

## Styling

The application uses a modern, responsive design with:
- Clean, minimalist interface
- Consistent color scheme
- Responsive layout for all screen sizes
- Clear feedback for user actions

## Data Storage

The application uses browser's localStorage for data persistence:
- User accounts are stored locally
- Data persists across browser sessions
- Secure handling of user information

## Best Practices Implemented

- Form validation and error handling
- Responsive design principles
- Clean and maintainable code structure
- User feedback for all actions
- Secure password handling
