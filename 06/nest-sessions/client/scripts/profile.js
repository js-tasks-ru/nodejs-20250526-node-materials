document.addEventListener('DOMContentLoaded', async () => {
  // Get session ID from localStorage
  const sid = localStorage.getItem('sid');

  if (!sid) {
    window.location.href = '/';
    return;
  }

  // Variables to store user data and sessions
  let userData = null;
  let currentSessionId = sid;
  let allSessions = [];

  // Function to handle API requests with session authentication
  async function fetchWithSession(url, options = {}) {
    // Add the session ID to request headers
    const headers = {
      ...options.headers,
      Authorization: `Session ${sid}`,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('sid');
          window.location.href = '/';
          return null;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }

  // Function to load user profile data
  async function loadUserProfile() {
    const response = await fetchWithSession('/auth/profile');
    if (!response) return;

    userData = await response.json();

    // Update profile information
    document.getElementById('username-display').textContent =
      userData.username || 'Неизвестный пользователь';
    document.getElementById('role-display').textContent =
      `Роль: ${userData.role === 'admin' ? 'Администратор' : 'Пользователь'}`;
    document.getElementById('user-id').textContent =
      `ID: ${userData.id || 'Неизвестно'}`;

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
  }

  // Function to load all sessions for the current user
  async function loadSessions() {
    const response = await fetchWithSession('/auth/sessions');
    if (!response) return;

    allSessions = await response.json();
    renderSessions();
  }

  // Function to render sessions list
  function renderSessions() {
    const container = document.getElementById('sessions-container');

    // Clear loading indicator
    container.innerHTML = '';

    if (!allSessions.length) {
      container.innerHTML =
        '<div class="no-sessions">Нет активных сессий</div>';
      return;
    }

    // Sort sessions - current session first, then by last active date (newest first)
    allSessions.sort((a, b) => {
      if (a.id === currentSessionId) return -1;
      if (b.id === currentSessionId) return 1;
      return new Date(b.lastActive) - new Date(a.lastActive);
    });

    allSessions.forEach((session) => {
      const isCurrentSession = session.id === currentSessionId;
      const sessionDate = new Date(session.createdAt);
      const lastActiveDate = new Date(session.lastActive);

      // Determine icon based on device name
      let deviceIcon = 'fa-desktop';
      if (
        session.deviceName.includes('iPhone') ||
        session.deviceName.includes('Android Phone')
      ) {
        deviceIcon = 'fa-mobile-alt';
      } else if (
        session.deviceName.includes('iPad') ||
        session.deviceName.includes('Android Tablet')
      ) {
        deviceIcon = 'fa-tablet-alt';
      }

      const sessionElement = document.createElement('div');
      sessionElement.className = `session-card ${isCurrentSession ? 'current-session' : ''}`;
      sessionElement.innerHTML = `
        <div class="session-info">
          <div class="device-icon">
            <i class="fas ${deviceIcon}"></i>
          </div>
          <div class="session-details">
            <div class="device-name">${session.deviceName} ${isCurrentSession ? '(Текущая сессия)' : ''}</div>
            <div class="session-meta">
              <span><i class="fas fa-clock"></i> Создана: ${formatDate(sessionDate)}</span>
              <span><i class="fas fa-sync-alt"></i> Активность: ${formatDate(lastActiveDate)}</span>
              <span><i class="fas fa-map-marker-alt"></i> IP: ${session.ipAddress || 'Неизвестно'}</span>
            </div>
          </div>
        </div>
        <button class="terminate-btn" data-session-id="${session.id}" ${isCurrentSession ? 'disabled' : ''}>
          <i class="fas fa-times-circle"></i> Завершить
        </button>
      `;

      container.appendChild(sessionElement);

      // Add event listener for terminate button
      if (!isCurrentSession) {
        const terminateBtn = sessionElement.querySelector('.terminate-btn');
        terminateBtn.addEventListener('click', (e) => {
          terminateSession(session.id);
        });
      }
    });
  }

  // Function to terminate a session
  async function terminateSession(sessionId) {
    const confirmTerminate = confirm(
      'Вы уверены, что хотите завершить эту сессию?',
    );
    if (!confirmTerminate) return;

    const response = await fetchWithSession(`/auth/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (response && response.ok) {
      // Remove the session from our local array and re-render
      allSessions = allSessions.filter((session) => session.id !== sessionId);
      renderSessions();
    }
  }

  // Utility function to format dates nicely
  function formatDate(date) {
    // Check if date is valid
    if (!(date instanceof Date) || isNaN(date)) {
      return 'Некорректная дата';
    }

    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Format date options
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    };

    // For dates older than a day, include full date
    if (days > 0) {
      if (days < 7) {
        return `${days} дн. назад (${date.toLocaleString('ru-RU', options)})`;
      } else {
        return date.toLocaleString('ru-RU', options);
      }
    }

    // For dates within the last day
    if (hours > 0) {
      return `${hours} ч. назад`;
    }

    if (minutes > 0) {
      return `${minutes} мин. назад`;
    }

    return 'Только что';
  }

  // API test buttons
  const profileBtn = document.getElementById('profile-btn');
  const secretBtn = document.getElementById('secret-btn');
  const apiResult = document.getElementById('api-result');
  const logoutBtn = document.getElementById('logout-btn');

  // Update logout button functionality
  logoutBtn.addEventListener('click', async () => {
    try {
      // Try to terminate the current session on the server
      await fetchWithSession(`/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Clear session ID and redirect regardless of server response
      localStorage.removeItem('sid');
      window.location.href = '/';
    }
  });

  // Get profile data
  profileBtn.addEventListener('click', async () => {
    apiResult.textContent = 'Загрузка...';

    const response = await fetchWithSession('/auth/profile');
    if (!response) {
      apiResult.textContent = 'Ошибка получения данных';
      return;
    }

    const data = await response.json();
    apiResult.textContent = JSON.stringify(
      { status: response.status, data },
      null,
      2,
    );
  });

  // Try to access secret (admin only)
  secretBtn.addEventListener('click', async () => {
    apiResult.textContent = 'Загрузка...';

    const response = await fetchWithSession('/secret');
    if (!response) {
      apiResult.textContent = 'Ошибка получения данных';
      return;
    }

    const data = await response.json();
    apiResult.textContent = JSON.stringify(
      { status: response.status, data },
      null,
      2,
    );
  });

  // Load initial data
  await loadUserProfile();
  await loadSessions();

  // Refresh sessions every 5 seconds
  setInterval(loadSessions, 5000);
});
