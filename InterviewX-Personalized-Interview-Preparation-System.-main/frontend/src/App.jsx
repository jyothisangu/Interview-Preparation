import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResumePage from './pages/ResumePage';
import InterviewPage from './pages/InterviewPage';
import CodingPage from './pages/CodingPage';
import CompanyPage from './pages/CompanyPage';
import RoadmapPage from './pages/RoadmapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FeedbackPage from './pages/FeedbackPage';
import SkillForgePage from './pages/SkillForgePage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="coding" element={<CodingPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="skillforge" element={<SkillForgePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
