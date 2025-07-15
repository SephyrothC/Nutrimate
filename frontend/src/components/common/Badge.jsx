import React from 'react'

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-gray-700 text-gray-300',
        primary: 'bg-primary-500/20 text-primary-300',
        success: 'bg-green-500/20 text-green-300',
        warning: 'bg-yellow-500/20 text-yellow-300',
        danger: 'bg-red-500/20 text-red-300'
    }

    const classes = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`

    return (
        <span className={classes}>
            {children}
        </span>
    )
}

export default Badge