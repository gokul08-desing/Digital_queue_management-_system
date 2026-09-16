import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';
import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import JoinConfirmationPage from './pages/JoinConfirmationPage';
import ActiveQueuePage from './pages/ActiveQueuePage';
import SlotExchangePage from './pages/SlotExchangePage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Application Pages with Main Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/hospital/:hospitalId" element={<ServiceDetailsPage />} />
              <Route path="/hospital/:hospitalId/service/:serviceId" element={<ServiceDetailsPage />} />
              <Route path="/join-confirm" element={<JoinConfirmationPage />} />
              <Route path="/active-queue" element={<ActiveQueuePage />} />
              <Route path="/exchange" element={<SlotExchangePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueueProvider>
    </AuthProvider>
  );
}
