const { useState, useEffect } = React;

// ============================================
// DATA STORAGE (Local Storage)
// ============================================
// Initialize userDatabase from localStorage or empty array if not exists
let userDatabase = JSON.parse(localStorage.getItem('users')) || [];

// Function to update localStorage whenever userDatabase changes
const updateLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(userDatabase));
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate password strength based on various criteria
 * @param {string} password - Password to evaluate
 * @returns {string} - 'weak', 'medium', or 'strong'
 */
const calculatePasswordStrength = (password) => {
  if (password.length < 6) return 'weak';
  
  let strength = 0;
  
  // Check for different character types
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

/**
 * Format date to readable string
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ============================================
// LOGIN COMPONENT
// ============================================
function LoginPage({ onLogin, onNavigate }) {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Handle form submission for login
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate email format
    if (!validateEmail(email)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }

    // Validate password is not empty
    if (!password) {
      setFieldErrors({ password: 'Password is required' });
      return;
    }

    // Find user in database
    const user = userDatabase.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Login successful
      onLogin(user);
    } else {
      // Login failed
      setError('Invalid email or password');
    }
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">Sign in to your account</p>

        {/* Display error message if login fails */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <span className="error-message">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <span className="error-message">{fieldErrors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn">
            Login
          </button>
        </form>

        {/* Link to Registration */}
        <div className="auth-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REGISTRATION COMPONENT
// ============================================
function RegisterPage({ onRegister, onNavigate }) {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handle input changes and update form state
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate password strength in real-time
    if (name === 'password') {
      setPasswordStrength(value ? calculatePasswordStrength(value) : '');
    }
  };

  /**
   * Validate all form fields
   * @returns {boolean} - True if all validations pass
   */
  const validateForm = () => {
    const errors = {};

    // Check all required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission for registration
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if email already exists
    const existingUser = userDatabase.find((u) => u.email === formData.email);
    if (existingUser) {
      setError('An account with this email already exists');
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      memberSince: new Date().toISOString()
    };

    // Add user to database
    userDatabase.push(newUser);
    updateLocalStorage(); // Update localStorage after adding new user

    // Show success message and redirect to login after delay
    setSuccess(true);

    // Redirect to login after 1.5 seconds
    setTimeout(() => {
      onNavigate('login');
    }, 1500);
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">Join us today</p>

        {/* Display success message */}
        {success && (
          <div className="alert alert-success">
            Account created successfully! Redirecting to login...
          </div>
        )}

        {/* Display error message */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {fieldErrors.firstName && (
                <span className="error-message">{fieldErrors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {fieldErrors.lastName && (
                <span className="error-message">{fieldErrors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <span className="error-message">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password Input with Strength Indicator */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && (
              <span className="error-message">{fieldErrors.password}</span>
            )}
            {passwordStrength && !fieldErrors.password && (
              <div className={`password-strength strength-${passwordStrength}`}>
                Password strength: {passwordStrength}
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirmPassword && (
              <span className="error-message">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn">
            Create Account
          </button>
        </form>

        {/* Link to Login */}
        <div className="auth-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PROFILE COMPONENT
// ============================================
function ProfilePage({ user, onLogout, onUpdateProfile }) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

  /**
   * Handle input changes in edit mode
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validate edit form
   */
  const validateEditForm = () => {
    const errors = {};

    if (!editData.firstName.trim()) errors.firstName = 'First name is required';
    if (!editData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!editData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(editData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle saving profile changes
   */
  const handleSave = () => {
    setSuccess('');

    // Validate form
    if (!validateEditForm()) {
      return;
    }

    // Check if email already exists (if changed)
    if (editData.email !== user.email) {
      const existingUser = userDatabase.find(
        (u) => u.email === editData.email && u.id !== user.id
      );
      if (existingUser) {
        setFieldErrors({ email: 'This email is already in use' });
        return;
      }
    }

    // Update user data
    const updatedUser = {
      ...user,
      firstName: editData.firstName.trim(),
      lastName: editData.lastName.trim(),
      email: editData.email.trim()
    };

    // Update in database
    const userIndex = userDatabase.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      userDatabase[userIndex] = updatedUser;
      updateLocalStorage(); // Update localStorage after updating user
    }

    // Update parent component
    onUpdateProfile(updatedUser);

    // Exit edit mode
    setIsEditing(false);
    setSuccess('Profile updated successfully!');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  /**
   * Handle canceling edit mode
   */
  const handleCancel = () => {
    // Reset form to original values
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setFieldErrors({});
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <h1 className="profile-title">My Profile</h1>
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>

          {/* Success Message */}
          {success && <div className="alert alert-success">{success}</div>}
        </div>

        {/* Profile Information Card */}
        <div className="profile-card">
          <h2 className="profile-section-title">Account Information</h2>

          <div className="profile-info">
            {/* First Name */}
            <div className="profile-info-item">
              <span className="profile-info-label">First Name</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                    value={editData.firstName}
                    onChange={handleChange}
                  />
                  {fieldErrors.firstName && (
                    <span className="error-message">{fieldErrors.firstName}</span>
                  )}
                </div>
              ) : (
                <span className="profile-info-value">{user.firstName}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="profile-info-item">
              <span className="profile-info-label">Last Name</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="lastName"
                    className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                    value={editData.lastName}
                    onChange={handleChange}
                  />
                  {fieldErrors.lastName && (
                    <span className="error-message">{fieldErrors.lastName}</span>
                  )}
                </div>
              ) : (
                <span className="profile-info-value">{user.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="profile-info-item">
              <span className="profile-info-label">Email Address</span>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    value={editData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && (
                    <span className="error-message">{fieldErrors.email}</span>
                  )}
                </div>
              ) : (
                <span className="profile-info-value">{user.email}</span>
              )}
            </div>

            {/* Member Since (Read-only) */}
            <div className="profile-info-item">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {formatDate(user.memberSince)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            {isEditing ? (
              <>
                <button className="btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  // Application state
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Handle successful login
   */
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('profile');
  };

  /**
   * Handle successful registration
   */
  const handleRegister = () => {
    setCurrentPage('login');
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  /**
   * Handle profile updates
   */
  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  /**
   * Handle navigation between pages
   */
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Render current page based on state
  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
      )}
      {currentPage === 'register' && (
        <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />
      )}
      {currentPage === 'profile' && currentUser && (
        <ProfilePage
          user={currentUser}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}

// ============================================
// RENDER APP TO DOM
// ============================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);