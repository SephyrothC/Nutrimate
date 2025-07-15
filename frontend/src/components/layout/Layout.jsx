import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Header from './Header'
import Sidebar from './Sidebar'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { loadUser, isLoading, isAuthenticated } = useAuthStore()

    useEffect(() => {
        loadUser()
    }, [loadUser])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return children // Auth pages (login/register)
    }

    return (
        <div className="min-h-screen bg-secondary-900">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="flex-1 p-6 lg:ml-0">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout