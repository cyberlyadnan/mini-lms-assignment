export const API_BASE_URL = 'https://api.freeapi.app';

export const SECURE_KEYS = {
  TOKEN_KEY: 'access_token',
  USER_KEY: 'user_data',
};

export const ASYNC_KEYS = {
  BOOKMARKS_KEY: 'bookmarked_courses',
  PREFERENCES_KEY: 'app_preferences',
  LAST_OPENED_KEY: 'last_opened_at',
};

export const APP_CONFIG = {
  TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
};

export const ENROLLED_COURSE_KEY = 'enrolled_courses';

export const COURSE_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Course Content</title>
  <style>
    body {
      background-color: #0F172A;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .header {
      background-color: #1E293B;
      padding: 24px;
      border-bottom: 1px solid #334155;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #FFFFFF;
    }
    .instructor {
      font-size: 14px;
      color: #94A3B8;
      margin: 0;
    }
    .content {
      padding: 24px;
    }
    .placeholder-video {
      background-color: #1E293B;
      width: 100%;
      height: 200px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 1px dashed #475569;
    }
    .play-button {
      width: 48px;
      height: 48px;
      background-color: #6366F1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .play-triangle {
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 12px solid white;
      margin-left: 4px;
    }
    .description {
      font-size: 16px;
      color: #CBD5E1;
      margin-bottom: 32px;
    }
    .button-container {
      margin-top: 40px;
      text-align: center;
    }
    .back-btn {
      background-color: #6366F1;
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
    }
    .back-btn:active {
      background-color: #4F46E5;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title" id="course-title">Loading...</h1>
    <p class="instructor" id="course-instructor">Instructor: Loading...</p>
  </div>
  
  <div class="content">
    <div class="placeholder-video">
      <div class="play-button">
        <div class="play-triangle"></div>
      </div>
    </div>
    
    <h3 style="margin-top: 0; color: #FFFFFF;">About This Module</h3>
    <p class="description" id="course-desc">Please wait while we load the course contents.</p>
    
    <div class="button-container">
      <button class="back-btn" onclick="goBack()">Back to App</button>
    </div>
  </div>

  <script>
    // Listen for messages from React Native
    document.addEventListener("message", function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'COURSE_DATA') {
          document.getElementById('course-title').textContent = data.title || 'Course Details';
          document.getElementById('course-desc').textContent = data.description || 'No description available.';
          document.getElementById('course-instructor').textContent = 'Instructor: ' + (data.instructorName || 'Unknown');
        }
      } catch (e) {
        console.error('Error parsing message from Native', e);
      }
    });

    // Fallback for iOS
    window.addEventListener("message", function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'COURSE_DATA') {
          document.getElementById('course-title').textContent = data.title || 'Course Details';
          document.getElementById('course-desc').textContent = data.description || 'No description available.';
          document.getElementById('course-instructor').textContent = 'Instructor: ' + (data.instructorName || 'Unknown');
        }
      } catch (e) {
        console.error('Error parsing message from Native', e);
      }
    });

    function goBack() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BACK' }));
      }
    }
  </script>
</body>
</html>
`;
