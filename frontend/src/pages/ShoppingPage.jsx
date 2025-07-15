import React, { useEffect, useState } from 'react'
import { ShoppingCart, Download, Check, Plus } from 'lucide-react'
import { useShoppingStore } from '@/stores/shoppingStore'
import { useMenuStore } from '@/stores/menuStore'
import ShoppingList from '@/components/shopping/ShoppingList'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import EmptyState from '@/components/common/EmptyState'
import { formatDate } from '@/utils/helpers'

const ShoppingPage = () => {
    const {
        shoppingLists,
        currentList,
        isLoading,
        loadShoppingLists,
        updateItem,
        exportToPDF,
        setCurrentList
    } = useShoppingStore()

    const { menus, loadMenus } = useMenuStore()

    const [selectedListId, setSelectedListId] = useState(null)

    useEffect(() => {
        loadShoppingLists()
        loadMenus()
    }, [loadShoppingLists, loadMenus])

    useEffect(() => {
        if (shoppingLists.length > 0 && !selectedListId) {
            const activeList = shoppingLists.find(list => list.is_active) || shoppingLists[0]
            setSelectedListId(activeList.id)
            setCurrentList(activeList)
        }
    }, [shoppingLists, selectedListId, setCurrentList])

    const handleItemToggle = async (itemIndex, checked) => {
        if (currentList) {
            await updateItem(currentList.id, itemIndex, { checked })
        }
    }

    const handleExportPDF = async () => {
        if (currentList) {
            await exportToPDF(currentList.id)
        }
    }

    const checkedItemsCount = currentList?.items?.filter(item => item.checked).length || 0
    const totalItemsCount = currentList?.items?.length || 0
    const progress = totalItemsCount > 0 ? (checkedItemsCount / totalItemsCount) * 100 : 0

    if (selectedListId && currentList) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSelectedListId(null)
                            setCurrentList(null)
                        }}
                    >
                        ← Retour aux listes
                    </Button>

                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={handleExportPDF}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exporter PDF
                        </Button>
                    </div>
                </div>

                {/* Progress */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-white">Liste de Courses</h1>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Progression</div>
                            <div className="text-lg font-semibold text-white">
                                {checkedItemsCount}/{totalItemsCount} articles
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-gray-400">
                        Générée le {formatDate(currentList.generated_at)}
                    </p>
                </Card>

                {/* Shopping List */}
                <ShoppingList
                    items={currentList.items}
                    onItemToggle={handleItemToggle}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Listes de Courses</h1>
                    <p className="text-gray-400 mt-1">
                        Gérez vos listes de courses automatiques
                    </p>
                </div>
            </div>

            {/* Lists */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : shoppingLists.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shoppingLists.map((list) => {
                        const checkedCount = list.items.filter(item => item.checked).length
                        const totalCount = list.items.length
                        const listProgress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

                        return (
                            <Card
                                key={list.id}
                                hover
                                onClick={() => {
                                    setSelectedListId(list.id)
                                    setCurrentList(list)
                                }}
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Liste de courses
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {formatDate(list.generated_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Progression</span>
                                        <span className="text-white font-medium">
                                            {checkedCount}/{totalCount}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${listProgress}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">
                                            {totalCount} articles
                                        </span>
                                        {list.is_active && (
                                            <div className="flex items-center space-x-1 text-xs text-green-400">
                                                <Check className="w-3 h-3" />
                                                <span>Active</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={ShoppingCart}
                    title="Aucune liste de courses"
                    description="Créez un menu hebdomadaire pour générer automatiquement votre liste de courses"
                    action={() => window.location.href = '/menus'}
                    actionLabel="Créer un menu"
                />
            )}

            {/* Available Menus */}
            {menus.length > 0 && (
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Générer une nouvelle liste
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Choisissez un menu pour générer automatiquement la liste de courses correspondante
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {menus.slice(0, 4).map((menu) => (
                            <div
                                key={menu.id}
                                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                            >
                                <div>
                                    <div className="font-medium text-white">
                                        Semaine du {formatDate(menu.week_start_date)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Créé le {formatDate(menu.created_at)}
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        // Générer liste pour ce menu
                                        window.location.href = `/menus`
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default ShoppingPage