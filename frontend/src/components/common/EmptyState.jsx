import React from 'react'
import Button from './Button'

const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    actionLabel
}) => {
    return (
        <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                {Icon && <Icon className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
            {action && actionLabel && (
                <Button onClick={action}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

export default EmptyState