const Loader = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <span
                aria-label="Loading"
                role="status"
                className="inline-block h-6 w-6 animate-spin rounded-full border border-neutral-200"
                style={{ borderTopColor: 'oklch(72.3% 0.219 149.579)' }}
            />
        </div>
    );
};

export default Loader;