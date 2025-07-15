import React, { useEffect, useState } from 'react'
import { Calendar, Plus, Eye, ShoppingCart } from 'lucide-react'
import { useMenuStore } from '@/stores/menuStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useShoppingStore } from '@/stores/shoppingStore'
import WeeklyGrid from '@/components/menus/WeeklyGrid'
import MenuGenerator from '@/components/menus/MenuGenerator'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import EmptyState from '@/components/common/EmptyState'
import { getWeekStartDate, getWeekDateRange, formatDate } from '@/utils/helpers'

const MenusPage = () => {
    const {
        menus,
        currentMenu,
        isLoading,
        isGenerating,
        loadMenus,
        loadMenuDetails,
        generateMenu
    } = useMenuStore()

    const { recipes, loadRecipes } = useRecipeStore()
    const { generateShoppingList } = useShoppingStore()

    const [showGenerator, setShowGenerator] = useState(false)
    const [selectedMenuId, setSelectedMenuId] = useState(null)

    useEffect(() => {
        loadMenus()
        loadRecipes()
    }, [loadMenus, loadRecipes])

    const handleGenerateMenu = async (generateData) => {
        const newMenu = await generateMenu(generateData)
        if (newMenu) {
            setShowGenerator(false)
            setSelectedMenuId(newMenu.id)
        }
    }

    const handleViewMenu = async (menuId) => {
        setSelectedMenuId(menuId)
        await loadMenuDetails(menuId)
    }

    const handleGenerateShoppingList = async () => {
        if (currentMenu) {
            await generateShoppingList(currentMenu.id)
        }
    }

    if (selectedMenuId && currentMenu) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSelectedMenuId(null)
                            setCurrentMenu(null)
                        }}
                    >
                        ← Retour aux menus
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleGenerateShoppingList}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Générer liste de courses
                    </Button>
                </div>

                {/* Menu Detail */}
                <Card>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Menu de la semaine
                    </h1>
                    <p className="text-gray-400">
                        {getWeekDateRange(currentMenu.week_start_date).start} - {getWeekDateRange(currentMenu.week_start_date).end}
                    </p>
                </Card>

                <WeeklyGrid
                    menuData={currentMenu.menu_data}
                    isLoading={isLoading}
                />
            </div>
        )
    }

    if (showGenerator) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Générer un Menu</h1>
                    <Button
                        variant="ghost"
                        onClick={() => setShowGenerator(false)}
                    >
                        Annuler
                    </Button>
                </div>

                <MenuGenerator
                    onGenerate={handleGenerateMenu}
                    isLoading={isGenerating}
                    availableRecipes={recipes}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mes Menus</h1>
                    <p className="text-gray-400 mt-1">
                        Planifiez vos repas de la semaine
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => setShowGenerator(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouveau menu
                </Button>
            </div>

            {/* Menus List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : menus.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <Card key={menu.id} hover onClick={() => handleViewMenu(menu.id)}>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        Semaine du {formatDate(menu.week_start_date)}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Créé le {formatDate(menu.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">
                                    7 jours planifiés
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleViewMenu(menu.id)
                                    }}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Calendar}
                    title="Aucun menu créé"
                    description="Commencez par générer votre premier menu hebdomadaire personnalisé"
                    action={() => setShowGenerator(true)}
                    actionLabel="Créer un menu"
                />
            )}

            {/* Info Card */}
            {recipes.length < 7 && (
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-2">⚠️ Recettes insuffisantes</h3>
                            <p className="text-sm text-gray-300 mb-3">
                                Vous avez {recipes.length} recette(s). Pour générer un menu complet,
                                nous recommandons au moins 7 recettes variées.
                            </p>
                            <Button variant="primary" size="sm" onClick={() => window.location.href = '/generate'}>
                                Générer plus de recettes
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default MenusPage