export const Input = ({
                          type = 'text',
                          placeholder = '',
                          value,
                          onChange,
                          name,
                          id,
                          label,
                          error,
                          required = false,
                          className = '',
                          ...props
                      }) => {
    const baseClasses = 'w-full px-4 py-2 text-gray-700 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-600';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';

    const classes = [
        baseClasses,
        errorClasses,
        className
    ].join(' ');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id || name}
                    className="block mb-2 text-sm font-medium text-gray-700"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                type={type}
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={classes}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
