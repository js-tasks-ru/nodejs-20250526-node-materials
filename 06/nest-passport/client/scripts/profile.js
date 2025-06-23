document.addEventListener('DOMContentLoaded', async () => {
  // Get stored tokens
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken) {
    window.location.href = '/';
    return;
  }

  // Display token
  const tokenContent = document.getElementById('token-content');
  tokenContent.textContent = accessToken;

  // Function to handle token refresh
  async function refreshAccessToken() {
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      // Update stored tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Update the displayed token
      tokenContent.textContent = data.accessToken;

      // Update the expiry display with new token information
      updateTokenExpiryDisplay();

      // Return the new access token
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Redirect to login if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  }

  // Function to handle API requests with token refresh
  async function fetchWithTokenRefresh(url, options = {}) {
    // Add the access token to request
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    // Make initial request
    let response = await fetch(url, { ...options, headers });

    // If unauthorized and we have a refresh token, try refreshing
    if (response.status === 401 && refreshToken) {
      try {
        // Get new access token
        accessToken = await refreshAccessToken();

        // Retry request with new token
        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, { ...options, headers });
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }

    return response;
  }

  // Parse JWT token to get user info
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  }

  // Format expiration time
  function formatExpiryTime(expiryTimestamp) {
    if (!expiryTimestamp) return 'Unknown';

    const expiryDate = new Date(expiryTimestamp * 1000); // Convert from seconds to milliseconds
    const now = new Date();

    // Calculate time difference
    const diffMs = expiryDate - now;
    if (diffMs <= 0) return 'Истёк';

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format based on time remaining
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}, ${diffHours % 24} hour${diffHours % 24 !== 1 ? 's' : ''} (${expiryDate.toLocaleString()})`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}, ${diffMins % 60} minute${diffMins % 60 !== 1 ? 's' : ''} (${expiryDate.toLocaleString()})`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''}, ${diffSecs % 60} second${diffSecs % 60 !== 1 ? 's' : ''} (${expiryDate.toLocaleString()})`;
    } else {
      return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} (${expiryDate.toLocaleString()})`;
    }
  }

  // Update expiration display
  function updateTokenExpiryDisplay() {
    try {
      // Get access token expiry
      const accessTokenData = parseJwt(accessToken);
      const accessTokenExpiry = document.getElementById('access-token-expiry');
      accessTokenExpiry.textContent = formatExpiryTime(accessTokenData.exp);

      // Get refresh token expiry
      const refreshTokenData = parseJwt(refreshToken);
      const refreshTokenExpiry = document.getElementById(
        'refresh-token-expiry',
      );
      refreshTokenExpiry.textContent = formatExpiryTime(refreshTokenData.exp);

      // Set expiry status colors
      if (accessTokenData.exp * 1000 < Date.now() + 5 * 60 * 1000) {
        // Less than 5 minutes left
        accessTokenExpiry.classList.add('expiring-soon');
      }
    } catch (error) {
      console.error('Error updating token expiry display:', error);
    }
  }

  // Parse JWT and update profile information
  try {
    const userData = parseJwt(accessToken);

    // Update profile information
    document.getElementById('username-display').textContent =
      userData.username || 'Неизвестный пользователь';
    document.getElementById('role-display').textContent =
      `Роль: ${userData.role === 'admin' ? 'Администратор' : 'Пользователь'}`;
    document.getElementById('user-id').textContent =
      `ID: ${userData.sub || 'Неизвестно'}`;

    // Update avatar initials
    const initials = userData.username
      ? userData.username.substring(0, 2).toUpperCase()
      : 'UN';
    document.getElementById('avatar-initials').textContent = initials;

    // Show/hide admin link based on role
    const adminLink = document.getElementById('admin-link');
    if (userData.role === 'admin') {
      adminLink.style.display = 'block';
    } else {
      adminLink.style.display = 'none';
    }

    // Show token expiration information
    updateTokenExpiryDisplay();

    // Update the expiration display every minute
    setInterval(updateTokenExpiryDisplay, 60000);
  } catch (error) {
    console.error('Error displaying user data:', error);
  }

  // API test buttons
  const profileBtn = document.getElementById('profile-btn');
  const secretBtn = document.getElementById('secret-btn');
  const apiResult = document.getElementById('api-result');
  const logoutBtn = document.getElementById('logout-btn');

  // Update logout button functionality
  logoutBtn.addEventListener('click', async () => {
    // Clear tokens and redirect
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  });

  // Get profile data
  profileBtn.addEventListener('click', async () => {
    apiResult.textContent = 'Загрузка...';

    try {
      const response = await fetchWithTokenRefresh('/auth/profile');
      const data = await response.json();
      apiResult.textContent = JSON.stringify(
        { status: response.status, data },
        null,
        2,
      );
    } catch (error) {
      apiResult.textContent = JSON.stringify({ error: error.message }, null, 2);
    }
  });

  // Try to access secret (admin only)
  secretBtn.addEventListener('click', async () => {
    apiResult.textContent = 'Загрузка...';

    try {
      const response = await fetchWithTokenRefresh('/secret');
      const data = await response.json();
      apiResult.textContent = JSON.stringify(
        { status: response.status, data },
        null,
        2,
      );
    } catch (error) {
      apiResult.textContent = JSON.stringify({ error: error.message }, null, 2);
    }
  });
});
