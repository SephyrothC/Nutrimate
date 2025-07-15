import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sparkles, Zap } from 'lucide-react'
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '@/utils/constants'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'

const RecipeGenerator = ({ onGenerate, isLoading }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            count: 3,
            meal_type: '',
            additional_constraints: ''
        }
    })

    const count = watch('count')

    const onSubmit = (data) => {
        const generateData = {
            count: parseInt(data.count),
            meal_type: data.meal_type || null,
            additional_constraints: data.additional_constraints || null
        }
        onGenerate(generateData)
    }

    return (
        <Card>
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Générateur de Recettes IA</h2>
                    <p className="text-gray-400">Créez des recettes personnalisées selon vos préférences</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Nombre de recettes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre de recettes
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            {...register('count', { required: true, min: 1, max: 10 })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1</span>
                            <span className="text-primary-400 font-medium">{count} recette{count > 1 ? 's' : ''}</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Type de repas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Type de repas (optionnel)
                        </label>
                        <select
                            {...register('meal_type')}
                            className="input"
                        >
                            <option value="">Tous les types</option>
                            {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Contraintes supplémentaires */}
                <Input
                    label="Contraintes supplémentaires (optionnel)"
                    placeholder="Ex: végétarien, sans gluten, rapide, épicé..."
                    {...register('additional_constraints')}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    className="w-full"
                    size="lg"
                >
                    <Zap className="w-5 h-5 mr-2" />
                    Générer {count} recette{count > 1 ? 's' : ''}
                </Button>
            </form>
        </Card>
    )
}

export default RecipeGenerator
