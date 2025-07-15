import React from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Sparkles } from 'lucide-react'
import { getWeekStartDate } from '@/utils/helpers'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'

const MenuGenerator = ({ onGenerate, isLoading, availableRecipes }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            week_start_date: getWeekStartDate().toISOString().split('T')[0],
            preferences: ''
        }
    })

    const onSubmit = (data) => {
        onGenerate({
            week_start_date: data.week_start_date,
            preferences: data.preferences || null
        })
    }

    const hasEnoughRecipes = availableRecipes.length >= 7

    return (
        <Card>
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Générateur de Menu Hebdomadaire</h2>
                    <p className="text-gray-400">Créez un planning de repas équilibré pour la semaine</p>
                </div>
            </div>

            {!hasEnoughRecipes && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">⚠️</span>
                        <span className="text-yellow-300 font-medium">Attention</span>
                    </div>
                    <p className="text-yellow-200 text-sm mt-1">
                        Vous avez {availableRecipes.length} recette(s). Pour un menu optimal,
                        nous recommandons au moins 7 recettes variées.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="Date de début de semaine (Lundi)"
                        type="date"
                        {...register('week_start_date', { required: 'Date requise' })}
                        error={errors.week_start_date?.message}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Recettes disponibles
                        </label>
                        <div className="input bg-gray-700 text-gray-300 cursor-not-allowed">
                            {availableRecipes.length} recette(s) dans votre bibliothèque
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Préférences pour cette semaine (optionnel)
                    </label>
                    <textarea
                        {...register('preferences')}
                        placeholder="Ex: Plus de légumes, repas rapides en semaine, cuisine du monde le weekend..."
                        rows={3}
                        className="input resize-none"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={!hasEnoughRecipes}
                    className="w-full"
                    size="lg"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Générer le menu de la semaine
                </Button>

                {!hasEnoughRecipes && (
                    <p className="text-center text-gray-400 text-sm">
                        <a href="/generate" className="text-primary-400 hover:text-primary-300">
                            Générez plus de recettes
                        </a> pour débloquer cette fonctionnalité
                    </p>
                )}
            </form>
        </Card>
    )
}

export default MenuGenerator