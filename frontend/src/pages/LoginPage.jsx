import React from 'react'
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
        await login(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">N</span>
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">Connexion</h2>
                    <p className="mt-2 text-gray-400">
                        Accédez à votre assistant alimentaire
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            className="w-full"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Se connecter
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Pas encore de compte ?{' '}
                            <Link
                                to={ROUTES.REGISTER}
                                className="text-primary-400 hover:text-primary-300 font-medium"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage