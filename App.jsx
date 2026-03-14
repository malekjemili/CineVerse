import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from 'AuthContext'
import { ToastProvider } from 'ToastContext'
import { useAuth } from 'AuthContext'
import { Navigate } from 'react-router-dom'
import Sidebar    from 'Sidebar'
import MobileNav  from 'MobileNav'
import HomePage   from 'HomePage'
import FeedPage   from 'FeedPage'
import LoginPage  from 'LoginPage'
import RegisterPage   from 'RegisterPage'
import CreatePostPage from 'CreatePostPage'
import PostDetailPage from 'PostDetailPage'
import ProfilePage    from 'ProfilePage'

// Pages without sidebar (full-screen)
const FULL_SCREEN = ['/', '/login', '/register']

function Guard({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  return user ? children : <Navigate to="/login" replace/>
}

function Layout() {
  const loc = useLocation()
  const fullScreen = FULL_SCREEN.includes(loc.pathname)

  if (fullScreen) {
    return (
      <Routes>
        <Route path="/"         element={<HomePage/>}/>
        <Route path="/login"    element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar/>
      <div className="main-content">
        <div className="feed-column">
          <Routes>
            <Route path="/feed"        element={<FeedPage/>}/>
            <Route path="/post/:id"    element={<PostDetailPage/>}/>
            <Route path="/profile/:id" element={<ProfilePage/>}/>
            <Route path="/create"      element={<Guard><CreatePostPage/></Guard>}/>
            <Route path="*"            element={<Navigate to="/feed" replace/>}/>
          </Routes>
        </div>
      </div>
      <MobileNav/>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout/>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
