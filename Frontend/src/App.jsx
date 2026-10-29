import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AlertsProvider } from "./context/AlertsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Surveillance from "./pages/Surveillance";
import Community from "./pages/Community";
import Environmental from "./pages/Environmental";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import DataManagement from "./pages/DataManagement";
import Settings from "./pages/Settings";
import "./styles.css";

// Authenticated layout frame with Sidebar, TopHeader, and Content
function MainDashboardLayout({ children }) {
  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <TopHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}

// Public Route helper: If already logged in, go straight to dashboard
function PublicLoginRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertsProvider>
          <Routes>
            {/* Public Login & Administration Gate */}
            <Route path="/login" element={<PublicLoginRoute />} />

            {/* Public Access Surveillance & Healthcare Dashboard Pages */}
            <Route
              path="/"
              element={
                <MainDashboardLayout>
                  <Dashboard />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/surveillance"
              element={
                <MainDashboardLayout>
                  <Surveillance />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/community"
              element={
                <MainDashboardLayout>
                  <Community />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/environmental"
              element={
                <MainDashboardLayout>
                  <Environmental />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/prediction"
              element={
                <MainDashboardLayout>
                  <Prediction />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/alerts"
              element={
                <MainDashboardLayout>
                  <Alerts />
                </MainDashboardLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <MainDashboardLayout>
                  <Reports />
                </MainDashboardLayout>
              }
            />

            {/* Administrative Restricted Pages */}
            <Route
              path="/data-management"
              element={
                <ProtectedRoute adminOnly={true}>
                  <MainDashboardLayout>
                    <DataManagement />
                  </MainDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute adminOnly={true}>
                  <MainDashboardLayout>
                    <Settings />
                  </MainDashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AlertsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
