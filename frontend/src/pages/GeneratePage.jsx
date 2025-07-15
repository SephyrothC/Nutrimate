import React, { useState } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import RecipeGenerator from '@/components/recipes/RecipeGenerator'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import RecipeDetail from '@/components/recipes/RecipeDetail'
import { Sparkles, Save, RotateCcw } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import toast from 'react-hot-toast'

const GeneratePage = () => {
    const {
        generatedRecipes,
        isLoading,
        generateRecipes,
        saveRecipe,
        clearGenerated
    } = useRecipeStore()

    const [selectedRecipe, setSelectedRecipe] = useState(null)

    const handleGenerate = async (generateData) => {
        await generateRecipes(generateData)
    }

    const handleSaveRecipe = async (recipe) => {
        const saved = await saveRecipe({
            title: recipe.title,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            meal_type: recipe.meal_type,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            servings: recipe.servings,
            tags: recipe.tags
        })

        if (saved) {
            // Retirer de la liste générée
            const newGenerated = generatedRecipes.filter(r => r.title !== recipe.title)
            clearGenerated()
        }
    }

    const handleSaveAll = async () => {
        let savedCount = 0

        for (const recipe of generatedRecipes) {
            const saved = await saveRecipe({
                title: recipe.title,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                meal_type: recipe.meal_type,
                prep_time: recipe.prep_time,
                cook_time: recipe.cook_time,
                servings: recipe.servings,
                tags: recipe.tags
            })

            if (saved) savedCount++
        }

        if (savedCount > 0) {
            clearGenerated()
            toast.success(`${savedCount} recette(s) sauvegardée(s)!`)
        }
    }

    if (selectedRecipe) {
        return (
            <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setSelectedRecipe(null)}
            />
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                    Générateur de Recettes IA
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Laissez l'intelligence artificielle créer des recettes personnalisées selon vos goûts et contraintes
                </p>
            </div>

            {/* Generator */}
            <RecipeGenerator
                onGenerate={handleGenerate}
                isLoading={isLoading}
            />

            {/* Generated Recipes */}
            {generatedRecipes.length > 0 && (
                <div className="space-y-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Recettes générées ({generatedRecipes.length})
                                </h2>
                                <p className="text-gray-400 mt-1">
                                    Sauvegardez les recettes qui vous plaisent dans votre bibliothèque
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    variant="secondary"
                                    onClick={clearGenerated}
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Effacer
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleSaveAll}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Sauvegarder tout
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <RecipeGrid
                        recipes={generatedRecipes}
                        isGenerated={true}
                        onView={setSelectedRecipe}
                        onSave={handleSaveRecipe}
                        emptyTitle="Aucune recette générée"
                        emptyDescription="Utilisez le générateur ci-dessus pour créer des recettes personnalisées"
                    />
                </div>
            )}

            {/* Tips */}
            <Card className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/20">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">💡 Conseils pour de meilleures recettes</h3>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li>• Soyez précis dans vos contraintes (ex: "végétarien, 30 min max, épicé")</li>
                            <li>• Mentionnez vos allergies ou intolérances</li>
                            <li>• Spécifiez le niveau de difficulté souhaité</li>
                            <li>• Indiquez si vous avez des ingrédients spécifiques à utiliser</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default GeneratePage