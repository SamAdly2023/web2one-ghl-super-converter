import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
// Google One Tap removed in favor of Firebase Auth
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { UserGuide } from './pages/UserGuide';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactElement, requireAdmin?: boolean }) => {
    const { user, isAdmin } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            {/* Firebase Auth used for Google sign-in */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/guide" element={<UserGuide />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;
