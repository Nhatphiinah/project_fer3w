/*
 * Assignment create by Group 2
 */
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import StoryList from "./pages/story/StoryList";
import { GenreProvider } from "./context/GenreContext";
import StoryDetail from "./pages/story/StoryDetail";
import StoryReader from "./pages/story/StoryReader";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
function App() {

  return (
    <div className="App">
      <GenreProvider>
        <AuthProvider>
          <header>
            <Header />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<StoryList />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/stories/read/:id" element={<StoryReader />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <footer>
            <Footer />
          </footer>
        </AuthProvider>
      </GenreProvider>
    </div>
  );
}

export default App;
