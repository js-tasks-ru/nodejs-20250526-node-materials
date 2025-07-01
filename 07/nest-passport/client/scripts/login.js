document.addEventListener('DOMContentLoaded', () => {
  // Check for existing token and redirect if found
  if (localStorage.getItem('accessToken')) {
    window.location.href = '/profile.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const githubBtn = document.querySelector('.github-btn');

  // Function to show validation errors
  function showError(element, message) {
    // Remove any existing error
    removeError(element);

    // Add error class to input
    element.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    // Insert after the input
    element.parentNode.appendChild(errorElement);
  }

  // Function to remove validation errors
  function removeError(element) {
    element.classList.remove('error');
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  // Function to show alerts (for login failures, etc)
  function showAlert(message, type = 'error') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;

    const iconClass =
      type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';

    alertElement.innerHTML = `
      <span class="alert-icon"><i class="fas ${iconClass}"></i></span>
      <span class="alert-message">${message}</span>
    `;

    // Insert at the top of the form
    loginForm.parentNode.insertBefore(alertElement, loginForm);
  }

  // Input validation on blur
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  usernameInput.addEventListener('blur', () => {
    if (usernameInput.value.trim() === '') {
      showError(usernameInput, 'Имя пользователя обязательно');
    }
  });

  passwordInput.addEventListener('blur', () => {
    if (passwordInput.value.trim() === '') {
      showError(passwordInput, 'Пароль обязателен');
    }
  });

  // Clear errors when input receives focus
  usernameInput.addEventListener('focus', () => removeError(usernameInput));
  passwordInput.addEventListener('focus', () => removeError(passwordInput));

  // Handle email/password login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear any existing errors or alerts
    removeError(usernameInput);
    removeError(passwordInput);
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Basic form validation
    let hasError = false;

    if (username.trim() === '') {
      showError(usernameInput, 'Имя пользователя обязательно');
      hasError = true;
    }

    if (password.trim() === '') {
      showError(passwordInput, 'Пароль обязателен');
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          'Ошибка входа. Пожалуйста, проверьте данные и попробуйте снова.';
        showAlert(errorMessage);
        return;
      }

      const data = await response.json();

      // Store both tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      window.location.href = '/profile.html';
    } catch (error) {
      showAlert(
        'Ошибка входа. Пожалуйста, проверьте данные и попробуйте снова.',
      );
      console.error('Login error:', error);
    }
  });

  // Handle GitHub login
  githubBtn.addEventListener('click', () => {
    window.location.href = '/auth/github';
  });
});
