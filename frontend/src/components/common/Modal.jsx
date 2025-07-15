import React from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) => {
    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className={`relative w-full ${sizes[size]} transform transition-all`}>
                    <div className="card animate-slide-up">
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                                <h3 className="text-lg font-semibold text-white">{title}</h3>
                                {showCloseButton && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal