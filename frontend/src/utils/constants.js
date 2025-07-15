export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const MEAL_TYPES = {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
    SNACK: 'snack'
}

export const MEAL_TYPE_LABELS = {
    [MEAL_TYPES.BREAKFAST]: 'Petit-déjeuner',
    [MEAL_TYPES.LUNCH]: 'Déjeuner',
    [MEAL_TYPES.DINNER]: 'Dîner',
    [MEAL_TYPES.SNACK]: 'Collation'
}

export const DIETARY_GOALS = {
    WEIGHT_LOSS: 'weight_loss',
    MUSCLE_GAIN: 'muscle_gain',
    MAINTENANCE: 'maintenance',
    HEALTHY_EATING: 'healthy_eating',
    QUICK_MEALS: 'quick_meals'
}

export const DIETARY_GOAL_LABELS = {
    [DIETARY_GOALS.WEIGHT_LOSS]: 'Perte de poids',
    [DIETARY_GOALS.MUSCLE_GAIN]: 'Prise de muscle',
    [DIETARY_GOALS.MAINTENANCE]: 'Maintien',
    [DIETARY_GOALS.HEALTHY_EATING]: 'Alimentation saine',
    [DIETARY_GOALS.QUICK_MEALS]: 'Repas rapides'
}

export const DAYS_OF_WEEK = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export const DAY_LABELS = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
}

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    RECIPES: '/recipes',
    GENERATE: '/generate',
    MENUS: '/menus',
    SHOPPING: '/shopping'
}
