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

export const COURSE_COVERS = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", 
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", 
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80", 
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80", 
  "https://images.unsplash.com/photo-1584697964154-7f8d8f7a8c7f?w=800&q=80", 
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80", 
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", 
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", 
  "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80", 
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80"  
];

export const getCourseCover = (id?: number | string | null): string => {
  if (!id) return COURSE_COVERS[0];
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) return COURSE_COVERS[0];
  return COURSE_COVERS[numId % COURSE_COVERS.length];
};

export const getCourseHTMLTemplate = (title: string, instructor: string, description: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Course Content</title>
  <style>
    :root {
      --primary: #6366F1;
      --bg: #0F172A;
      --surface: #1E293B;
      --border: #334155;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
      padding: 32px 24px 24px;
      border-bottom: 1px solid var(--border);
    }
    .title {
      font-size: 28px;
      font-weight: 800;
      margin: 0 0 12px 0;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      line-height: 1.3;
    }
    .instructor {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: var(--text-muted);
      margin: 0;
      font-weight: 500;
    }
    .instructor-badge {
      background-color: rgba(99, 102, 241, 0.15);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-left: 12px;
    }
    .content {
      padding: 24px;
    }
    .video-container {
      position: relative;
      width: 100%;
      height: 220px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 32px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      background-color: #000;
    }
    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
    }
    .play-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.4);
    }
    .play-button {
      width: 64px;
      height: 64px;
      background-color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .play-button:active {
      transform: scale(0.95);
    }
    .play-triangle {
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 16px solid white;
      margin-left: 6px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
    }
    .description {
      font-size: 16px;
      color: #CBD5E1;
      margin-bottom: 40px;
      background-color: var(--surface);
      padding: 20px;
      border-radius: 16px;
      border: 1px solid var(--border);
    }
    .button-container {
      margin-top: 20px;
      margin-bottom: 40px;
    }
    .back-btn {
      background-color: var(--surface);
      color: white;
      border: 1px solid var(--border);
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .back-btn:active {
      background-color: var(--bg);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">${title}</h1>
    <div class="instructor">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      ${instructor}
      <span class="instructor-badge">Author</span>
    </div>
  </div>
  
  <div class="content">
    <div class="video-container" onclick="playVideo()">
      <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="video-thumbnail" alt="Video presentation" />
      <div class="play-overlay">
        <div class="play-button">
          <div class="play-triangle"></div>
        </div>
      </div>
    </div>
    
    <h3 class="section-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
      About This Module
    </h3>
    <div class="description">${description}</div>
    
    <div class="button-container">
      <button class="back-btn" onclick="goBack()">
        Back to App
      </button>
    </div>
  </div>

  <script>
    function playVideo() {
      // Logic to communicate play event
    }
    function goBack() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BACK' }));
      }
    }
  </script>
</body>
</html>
`;
