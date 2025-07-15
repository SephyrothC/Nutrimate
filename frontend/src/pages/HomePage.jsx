import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, Sparkles, Calendar, ShoppingCart, TrendingUp, Heart } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useMenuStore } from '@/stores/menuStore'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/utils/constants'

const HomePage = () => {
    const { user } = useAuthStore()
    const { recipes, loadRecipes, isLoading: recipesLoading } = useRecipeStore()
    const { menus, loadMenus, isLoading: menusLoading } = useMenuStore()

    useEffect(() => {
        loadRecipes()
        loadMenus()
    }, [loadRecipes, loadMenus])

    const favoriteRecipes = recipes.filter(recipe => recipe.is_favorite)
    const recentRecipes = recipes.slice(0, 3)
    const recentMenus = menus.slice(0, 2)

    const quickActions = [
        {
            icon: Sparkles,
            title: 'Générer des recettes',
            description: 'Créez des recettes personnalisées avec l\'IA',
            href: ROUTES.GENERATE,
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: ChefHat,
            title: 'Mes recettes',
            description: 'Consultez votre bibliothèque de recettes',
            href: ROUTES.RECIPES,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Calendar,
            title: 'Planifier la semaine',
            description: 'Créez votre menu hebdomadaire',
            href: ROUTES.MENUS,
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: ShoppingCart,
            title: 'Liste de courses',
            description: 'Générez votre liste automatiquement',
            href: ROUTES.SHOPPING,
            color: 'from-orange-500 to-red-500'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">
                    Bienvenue, <span className="gradient-text">{user?.username}</span> ! 👋
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Votre assistant alimentaire intelligent est là pour vous aider à manger mieux au quotidien.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                        <Link key={index} to={action.href}>
                            <Card hover className="text-center h-full">
                                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                                <p className="text-gray-400 text-sm">{action.description}</p>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <ChefHat className="w-5 h-5 text-primary-400" />
                        <span className="text-2xl font-bold text-white">
                            {recipesLoading ? <LoadingSpinner size="sm" /> : recipes.length}
                        </span>
                    </div>
                    <p className="text-gray-400">Recettes sauvegardées</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-2xl font-bold text-white">
                            {recipesLoading ? <LoadingSpinner size="sm" /> : favoriteRecipes.length}
                        </span>
                    </div>
                    <p className="text-gray-400">Recettes favorites</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <span className="text-2xl font-bold text-white">
                            {menusLoading ? <LoadingSpinner size="sm" /> : menus.length}
                        </span>
                    </div>
                    <p className="text-gray-400">Menus créés</p>
                </Card>
            </div>

            {/* Recent Content */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Recipes */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Recettes récentes</h2>
                        <Link to={ROUTES.RECIPES}>
                            <Button variant="ghost" size="sm">
                                Voir tout
                            </Button>
                        </Link>
                    </div>

                    {recipesLoading ? (
                        <LoadingSpinner />
                    ) : recentRecipes.length > 0 ? (
                        <div className="space-y-3">
                            {recentRecipes.map((recipe) => (
                                <div key={recipe.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                        <ChefHat className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">{recipe.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            {recipe.servings} pers. • {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                                        </p>
                                    </div>
                                    {recipe.is_favorite && (
                                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <ChefHat className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 mb-4">Aucune recette pour le moment</p>
                            <Link to={ROUTES.GENERATE}>
                                <Button variant="primary" size="sm">
                                    Générer des recettes
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Recent Menus */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Menus récents</h2>
                        <Link to={ROUTES.MENUS}>
                            <Button variant="ghost" size="sm">
                                Voir tout
                            </Button>
                        </Link>
                    </div>

                    {menusLoading ? (
                        <LoadingSpinner />
                    ) : recentMenus.length > 0 ? (
                        <div className="space-y-3">
                            {recentMenus.map((menu) => (
                                <div key={menu.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white">
                                            Semaine du {new Date(menu.week_start_date).toLocaleDateString('fr-FR')}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Créé le {new Date(menu.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 mb-4">Aucun menu pour le moment</p>
                            <Link to={ROUTES.MENUS}>
                                <Button variant="primary" size="sm">
                                    Créer un menu
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default HomePage