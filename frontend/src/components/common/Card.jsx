import React from 'react'

const Card = ({
    children,
    className = '',
    hover = false,
    onClick,
    ...props
}) => {
    const baseClasses = 'card'
    const hoverClasses = hover ? 'card-hover' : ''
    const clickableClasses = onClick ? 'cursor-pointer' : ''

    const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    )
}

export default Card