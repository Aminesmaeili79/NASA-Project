export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'medium',
                           onClick,
                           disabled = false,
                           type = 'button',
                           className = '',
                           ...props
                       }) => {
    const baseClasses = 'font-medium rounded focus:outline-none transition-colors';

    const sizeClasses = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
        outline: 'bg-transparent border border-current text-blue-600 hover:bg-blue-50 disabled:text-gray-300',
    };

    const classes = [
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
    ].join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};