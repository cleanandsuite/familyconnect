import { Routes, Route, useNavigate } from 'react-router'
import { useEffect } from 'react'
import Home from './pages/Home'
import TreePage from './pages/TreePage'
import GalleryPage from './pages/GalleryPage'
import DirectoryPage from './pages/DirectoryPage'
import StoryPage from './pages/StoryPage'
import RegisterPage from './pages/RegisterPage'
import LoadingPage from './pages/LoadingPage'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import { Navigation } from "./components/Navigation"
import { useAuth } from "./hooks/useAuth"

function PostLoginRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const storySeen = localStorage.getItem("lauj-story-seen");
      if (!storySeen) {
        navigate("/story", { replace: true });
      } else {
        navigate("/loading", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<PostLoginRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
