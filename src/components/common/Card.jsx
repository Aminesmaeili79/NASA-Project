import React from 'react';

export const Card = ({
                         children,
                         className = '',
                         padding = true,
                         shadow = true,
                         ...props
                     }) => {
    const baseClasses = 'bg-white rounded-lg overflow-hidden';
    const paddingClass = padding ? 'p-4' : '';
    const shadowClass = shadow ? 'shadow-md' : '';

    const classes = [
        baseClasses,
        paddingClass,
        shadowClass,
        className
    ].join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

