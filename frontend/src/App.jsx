import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/layout/Layout'
import { ROUTES } from '@/utils/constants'

// Pages
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'
import RecipesPage from '@/pages/RecipesPage'
import GeneratePage from '@/pages/GeneratePage'
import MenusPage from '@/pages/MenusPage'
import ShoppingPage from '@/pages/ShoppingPage'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} />
}

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    return !isAuthenticated ? children : <Navigate to={ROUTES.HOME} />
}

function App() {
    return (
        <Router>
            <div className="App">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#374151',
                            color: '#F9FAFB',
                            border: '1px solid #6B7280',
                        },
                        success: {
                            iconTheme: {
                                primary: '#8B5CF6',
                                secondary: '#FFFFFF',
                            },
                        },
                    }}
                />

                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path={ROUTES.LOGIN}
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path={ROUTES.REGISTER}
                            element={
                                <PublicRoute>
                                    <RegisterPage />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path={ROUTES.HOME}
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.PROFILE}
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.RECIPES}
                            element={
                                <ProtectedRoute>
                                    <RecipesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.GENERATE}
                            element={
                                <ProtectedRoute>
                                    <GeneratePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.MENUS}
                            element={
                                <ProtectedRoute>
                                    <MenusPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.SHOPPING}
                            element={
                                <ProtectedRoute>
                                    <ShoppingPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect */}
                        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
                    </Routes>
                </Layout>
            </div>
        </Router>
    )
}

export default App