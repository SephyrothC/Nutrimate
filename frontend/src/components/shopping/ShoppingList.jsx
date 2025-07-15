import React from 'react'
import { Check, ShoppingBasket } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

const CategorySection = ({ category, items, onItemToggle, startIndex }) => {
    const categoryIcons = {
        'Légumes': '🥕',
        'Fruits': '🍎',
        'Protéines': '🥩',
        'Produits laitiers': '🥛',
        'Féculents': '🍞',
        'Condiments': '🧂',
        'Autres': '📦'
    }

    return (
        <Card>
            <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{categoryIcons[category] || '📦'}</span>
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <div className="text-sm text-gray-400">
                    ({items.length} article{items.length > 1 ? 's' : ''})
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => {
                    const globalIndex = startIndex + index
                    return (
                        <div
                            key={globalIndex}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${item.checked
                                    ? 'bg-green-500/10 border border-green-500/20'
                                    : 'bg-gray-700/50 hover:bg-gray-700'
                                }`}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onItemToggle(globalIndex, !item.checked)}
                                className={`p-1 ${item.checked
                                        ? 'text-green-400 hover:text-green-300'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-500 hover:border-gray-400'
                                    }`}>
                                    {item.checked && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </Button>

                            <div className="flex-1">
                                <div className={`font-medium ${item.checked
                                        ? 'text-gray-400 line-through'
                                        : 'text-white'
                                    }`}>
                                    {item.name}
                                </div>
                                <div className={`text-sm ${item.checked
                                        ? 'text-gray-500'
                                        : 'text-gray-400'
                                    }`}>
                                    {item.quantity}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

const ShoppingList = ({ items, onItemToggle }) => {
    if (!items || items.length === 0) {
        return (
            <Card className="text-center py-12">
                <ShoppingBasket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Liste vide</h3>
                <p className="text-gray-400">Aucun article dans cette liste de courses</p>
            </Card>
        )
    }

    // Grouper les articles par catégorie
    const itemsByCategory = items.reduce((acc, item, index) => {
        const category = item.category || 'Autres'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push({ ...item, originalIndex: index })
        return acc
    }, {})

    const categories = Object.keys(itemsByCategory).sort()

    return (
        <div className="space-y-6">
            {categories.map(category => {
                const categoryItems = itemsByCategory[category]
                const startIndex = items.findIndex(item =>
                    categoryItems.some(catItem => catItem.originalIndex === items.indexOf(item))
                )

                return (
                    <CategorySection
                        key={category}
                        category={category}
                        items={categoryItems}
                        onItemToggle={onItemToggle}
                        startIndex={categoryItems[0].originalIndex}
                    />
                )
            })}

            {/* Summary */}
            <Card className="bg-primary-500/10 border-primary-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <ShoppingBasket className="w-5 h-5 text-primary-400" />
                        <span className="font-medium text-white">Total des articles</span>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-white">
                            {items.filter(item => item.checked).length} / {items.length}
                        </div>
                        <div className="text-sm text-primary-400">articles cochés</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ShoppingList