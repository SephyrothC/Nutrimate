import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button'

const Header = ({ onToggleSidebar }) => {
    const location = useLocation()
    const { user, logout } = useAuthStore()

    return (
        <header className="bg-surface border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleSidebar}
                        className="lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="font-bold text-xl gradient-text">NutriMate</span>
                    </Link>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                    {user && (
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">{user.username}</span>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-gray-400 hover:text-red-400"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:ml-2 sm:inline">Déconnexion</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header