import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'
import { ROUTES } from '@/utils/constants'

const LoginPage = () => {
    const { login, isLoading } = useAuthStore()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        const success = await registerUser({
            email: data.email,
            username: data.username,
            password: data.password,
            age: data.age ? parseInt(data.age) : null,
            dietary_goal: data.dietary_goal,
            preferences_prompt: data.preferences_prompt
        })

        if (success) {
            // Rediriger vers login après inscription réussie
            window.location.href = ROUTES.LOGIN
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-lg w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">N</span>
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">Inscription</h2>
                    <p className="mt-2 text-gray-400">
                        Créez votre compte NutriMate
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Nom d'utilisateur"
                                placeholder="Votre nom"
                                {...register('username', {
                                    required: 'Nom requis',
                                    minLength: {
                                        value: 2,
                                        message: 'Minimum 2 caractères'
                                    }
                                })}
                                error={errors.username?.message}
                            />

                            <Input
                                label="Âge (optionnel)"
                                type="number"
                                placeholder="25"
                                {...register('age', {
                                    min: {
                                        value: 13,
                                        message: 'Âge minimum: 13 ans'
                                    },
                                    max: {
                                        value: 120,
                                        message: 'Âge maximum: 120 ans'
                                    }
                                })}
                                error={errors.age?.message}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            placeholder="votre@email.com"
                            {...register('email', {
                                required: 'Email requis',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Email invalide'
                                }
                            })}
                            error={errors.email?.message}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Mot de passe"
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Mot de passe requis',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimum 6 caractères'
                                    }
                                })}
                                error={errors.password?.message}
                            />

                            <Input
                                label="Confirmer mot de passe"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword', {
                                    required: 'Confirmation requise',
                                    validate: value =>
                                        value === password || 'Les mots de passe ne correspondent pas'
                                })}
                                error={errors.confirmPassword?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Objectif alimentaire
                            </label>
                            <select
                                {...register('dietary_goal')}
                                className="input"
                            >
                                {Object.entries(DIETARY_GOAL_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Préférences alimentaires (optionnel)
                            </label>
                            <textarea
                                placeholder="Ex: Je suis étudiant, j'aime les repas rapides et sains, pas de fruits de mer, végétarien..."
                                rows={3}
                                {...register('preferences_prompt')}
                                className="input resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Ces informations aideront l'IA à personnaliser vos recettes
                            </p>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            className="w-full"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Créer mon compte
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Déjà un compte ?{' '}
                            <Link
                                to={ROUTES.LOGIN}
                                className="text-primary-400 hover:text-primary-300 font-medium"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage