export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export const validatePassword = (password) => {
    return password.length >= 6
}

export const validateAge = (age) => {
    const numAge = parseInt(age)
    return numAge >= 13 && numAge <= 120
}

export const validateRecipeTitle = (title) => {
    return title && title.length >= 3 && title.length <= 100
}

export const validateIngredients = (ingredients) => {
    return Array.isArray(ingredients) &&
        ingredients.length > 0 &&
        ingredients.every(ing => ing.name && ing.quantity)
}

export const validateSteps = (steps) => {
    return Array.isArray(steps) &&
        steps.length > 0 &&
        steps.every(step => step && step.length >= 5)
}