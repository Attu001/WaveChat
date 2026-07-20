# WaveChat Frontend

A modern real-time chat application frontend built with **React 19**, **Vite**, and **Tailwind CSS v4**. Features real-time messaging, push notifications, social posts, and a beautiful dark/light theme — all wrapped in smooth animations powered by Framer Motion.

> **Live Demo:** [wavechat-snowy.vercel.app](https://wavechat-snowy.vercel.app)  
> **Backend Repository:** [WaveChat_Backend](https://github.com/Attu001/WaveChat_Backend)

---

## Features

### 💬 Real-Time Chat
- One-to-one messaging with real-time updates via WebSocket
- Chat request system (send, accept, reject)
- Typing indicators and message history

### 🔔 Live Notifications
- WebSocket-powered real-time notifications
- Toast popups with notification sound
- Mark as read / mark all read
- Unread notification badge count

### 📝 Social Posts
- Create, like, and delete posts
- Explore feed to discover content from other users

### 👤 User Profiles
- View and edit profile (name, email, phone, bio, profile picture)
- Custom profile cards with status indicators
- User list with chat request status (sent / received / friends)

### 🎨 Modern UI/UX
- Dark / Light theme with smooth transition
- Page transitions and micro-interactions via Framer Motion
- Skeleton loaders and empty states
- Fully responsive mobile-first design
- Floating dark mode toggle
- Offline detection banner
- Notification sound alerts

### 🔐 Authentication
- Email-based registration with verification
- JWT-based login
- Route protection and persistent sessions

---

## Tech Stack

| Technology    | Purpose                        |
|---------------|--------------------------------|
| React 19      | UI framework                   |
| Vite 7        | Build tool & dev server        |
| Tailwind CSS v4 | Utility-first styling        |
| Redux Toolkit | State management               |
| React Router v7 | Client-side routing         |
| Axios         | HTTP client                    |
| Supabase      | Backend services               |
| Framer Motion | Animations & transitions       |
| React Icons   | Icon library                   |

---

## Project Structure

```
WaveChat/
├── public/                     # Static assets (logo, notification sound)
├── src/
│   ├── api/
│   │   ├── axios.js            # Axios instance with interceptors
│   │   └── services/
│   │       └── userServices.js # API service functions
│   ├── components/             # Reusable UI components
│   │   ├── BottomItem.jsx       # Navigation bar item
│   │   ├── Chats.jsx            # Chat list component
│   │   ├── CreatePostModal.jsx  # Post creation modal
│   │   ├── EditProfileModal.jsx # Profile editing modal
│   │   ├── EmptyState.jsx       # Empty state placeholder
│   │   ├── Error.jsx            # Error display
│   │   ├── Loading.jsx          # Loading indicator
│   │   ├── NotificationPage.jsx # Notifications page
│   │   ├── PageLoader.jsx       # Page-level loader
│   │   ├── PageTransition.jsx   # Page transition wrapper
│   │   ├── ProfileCard.jsx      # User profile card
│   │   ├── SkeletonLoader.jsx   # Skeleton loading placeholders
│   │   ├── SmallLoader.jsx      # Small spinner
│   │   ├── Success.jsx          # Success message
│   │   └── TabTransition.jsx    # Tab transition wrapper
│   ├── context/
│   │   ├── AudioContext.jsx     # Audio/sound context
│   │   └── ThemeContext.jsx     # Dark/light theme context
│   ├── pages/
│   │   ├── ChatRequestsPage.jsx # Chat request management
│   │   ├── ChatScreen.jsx       # Real-time chat interface
│   │   ├── ExploreFeed.jsx      # Explore / social feed
│   │   ├── Home.jsx             # Main dashboard
│   │   ├── Login.jsx            # Login page
│   │   ├── Posts.jsx            # User posts
│   │   ├── Profile.jsx          # User profile page
│   │   ├── Profilelist.jsx      # User list with statuses
│   │   ├── Signup.jsx           # Registration page
│   │   ├── UsersList.jsx        # All users list
│   │   └── VerifyUser.jsx       # Email verification page
│   ├── slices/
│   │   ├── errorSlice.js        # Redux error state
│   │   ├── notificationSlice.js # Redux notification state
│   │   ├── successSlice.js      # Redux success state
│   │   └── userSlice.js         # Redux user state
│   ├── App.jsx                  # Root component with routing
│   ├── App.css                  # Global styles
│   ├── api.js                   # API base configuration
│   ├── index.css                # Tailwind entry point
│   ├── main.jsx                 # Application entry point
│   ├── store.js                 # Redux store configuration
│   └── supabase.js              # Supabase client config
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
├── vercel.json                  # Vercel deployment config
└── package.json                 # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- Backend API running (see [WaveChat_Backend](https://github.com/Attu001/WaveChat_Backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/Attu001/WaveChat.git
cd WaveChat/wavechat

# Install dependencies
npm install

# Create environment variables (if applicable)
# The app auto-detects localhost vs production backend
```

### Development

```bash
# Start the Vite dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Build for Production

```bash
npm run build
npm run preview
```

---

## API Configuration

The frontend automatically detects whether it's running locally or in production and points to the appropriate backend URL:

| Environment   | Backend URL                                                  |
|---------------|--------------------------------------------------------------|
| **Local**     | `http://localhost:8000/` (HTTP) / `ws://localhost:8000/` (WS) |
| **Production**| `https://wavechat-backend-renderer.onrender.com/`            |

No manual configuration is needed — just ensure the backend server is running when developing locally.

---

## Available Scripts

| Script        | Description                   |
|---------------|-------------------------------|
| `npm run dev` | Start development server      |
| `npm run build` | Build for production        |
| `npm run preview` | Preview production build  |
| `npm run lint` | Run ESLint                   |

---

## Routing

| Path             | Component           | Description              |
|------------------|---------------------|--------------------------|
| `/`              | Login               | Login page (default)     |
| `/login`         | Login               | Login page               |
| `/signup`        | Signup              | Registration             |
| `/verify`        | VerifyUser          | Email verification       |
| `/home`          | MainLayout          | Main app dashboard       |
| `/chat-screen`   | ChatScreen          | Real-time chat           |
| `/list`          | Profilelist         | User list                |
| `/profile`       | Profile             | User profile             |
| `/notifications` | NotificationPage    | Notifications            |

---

## Deployment

The frontend is deployed on **Vercel**. To deploy your own instance:

1. Fork this repository
2. Connect it to your Vercel account
3. Configure the build settings (Vite will auto-detect)
4. Deploy

Ensure your backend is deployed and accessible, and update the CORS settings in the backend to include your Vercel domain.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)