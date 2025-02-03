
import { useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/header/Header';
import { NavAssistant } from './components/nav-assistant/NavAssistant';
import { Profile } from './pages/Profile';
import { All } from './pages/Landing';
import { Auth0ProviderWithNavigate } from './auth/Auth0ProviderWithNavigate';
import { ProtectedRoute } from './auth/ProtectedRoute';


const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  // feel free to style as you see fit
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <div className="App">
          <LiveAPIProvider url={uri} apiKey={API_KEY}>
            <Header />
            <NavAssistant />
            <Routes>
              <Route path="/" element={<All />} />
              <Route path="/all" element={<All />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
            <div className="video-container">
              <video ref={videoRef} autoPlay muted playsInline />
              <ControlTray
                videoRef={videoRef}
                onVideoStreamChange={setVideoStream}
                supportsVideo={true}
              >
                {/* put your own buttons here */}
              </ControlTray>
            </div>
          </LiveAPIProvider>
        </div>
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;
