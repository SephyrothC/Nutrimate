export const formatTime = (minutes) => {
    if (!minutes) return 'Non précisé'

    if (minutes < 60) {
        return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
        return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}min`
}

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date))
}

export const formatShortDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date))
}

export const getWeekStartDate = (date = new Date()) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lundi = 1
    return new Date(d.setDate(diff))
}

export const getWeekDateRange = (startDate) => {
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return {
        start: formatShortDate(start),
        end: formatShortDate(end)
    }
}

export const capitalizeFirst = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

export const getMealTypeIcon = (mealType) => {
    switch (mealType) {
        case 'breakfast':
            return '🌅'
        case 'lunch':
            return '☀️'
        case 'dinner':
            return '🌙'
        case 'snack':
            return '🍪'
        default:
            return '🍽️'
    }
}