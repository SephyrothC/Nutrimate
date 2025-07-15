import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    ChefHat,
    Sparkles,
    Calendar,
    ShoppingCart,
    User,
    X
} from 'lucide-react'
import Button from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()

    const navigation = [
        { name: 'Accueil', href: ROUTES.HOME, icon: Home },
        { name: 'Mes Recettes', href: ROUTES.RECIPES, icon: ChefHat },
        { name: 'Générer', href: ROUTES.GENERATE, icon: Sparkles },
        { name: 'Menus', href: ROUTES.MENUS, icon: Calendar },
        { name: 'Courses', href: ROUTES.SHOPPING, icon: ShoppingCart },
        { name: 'Profil', href: ROUTES.PROFILE, icon: User },
    ]

    return (
        <>
            {/* Backdrop mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Header mobile */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
                    <span className="font-bold text-lg gradient-text">Menu</span>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            const Icon = item.icon

                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        onClick={onClose}
                                        className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                                                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar