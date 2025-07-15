import React from 'react'
import { DAYS_OF_WEEK, DAY_LABELS, MEAL_TYPE_LABELS } from '@/utils/constants'
import { formatTime, getMealTypeIcon } from '@/utils/helpers'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const MealSlot = ({ meal, mealType }) => {
    if (!meal) {
        return (
            <div className="p-3 border-2 border-dashed border-gray-600 rounded-lg text-center">
                <span className="text-gray-500 text-sm">Aucun repas</span>
            </div>
        )
    }

    return (
        <Card className="p-3 hover:bg-gray-600/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                <h4 className="font-medium text-white text-sm line-clamp-1">
                    {meal.title}
                </h4>
            </div>
            <div className="text-xs text-gray-400">
                {meal.servings} pers. • {formatTime((meal.prep_time || 0) + (meal.cook_time || 0))}
            </div>
        </Card>
    )
}

const WeeklyGrid = ({ menuData, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    const mealTypes = ['breakfast', 'lunch', 'dinner']

    return (
        <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-8 gap-4">
                    {/* Header */}
                    <div className="font-semibold text-gray-400"></div>
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="font-semibold text-center text-gray-300">
                            {DAY_LABELS[day]}
                        </div>
                    ))}

                    {/* Meals */}
                    {mealTypes.map(mealType => (
                        <React.Fragment key={mealType}>
                            <div className="flex items-center font-medium text-gray-300">
                                <span className="mr-2">{getMealTypeIcon(mealType)}</span>
                                {MEAL_TYPE_LABELS[mealType]}
                            </div>
                            {DAYS_OF_WEEK.map(day => (
                                <MealSlot
                                    key={`${day}-${mealType}`}
                                    meal={menuData?.[day]?.[mealType]}
                                    mealType={mealType}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
                {DAYS_OF_WEEK.map(day => (
                    <Card key={day}>
                        <h3 className="font-semibold text-white mb-4 text-center">
                            {DAY_LABELS[day]}
                        </h3>
                        <div className="space-y-3">
                            {mealTypes.map(mealType => (
                                <div key={mealType}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span>{getMealTypeIcon(mealType)}</span>
                                        <span className="text-sm font-medium text-gray-300">
                                            {MEAL_TYPE_LABELS[mealType]}
                                        </span>
                                    </div>
                                    <MealSlot
                                        meal={menuData?.[day]?.[mealType]}
                                        mealType={mealType}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default WeeklyGrid