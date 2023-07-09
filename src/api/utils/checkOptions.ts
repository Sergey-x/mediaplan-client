const checkOptions = (options: any) => {
    if (options?.body && typeof options.body !== "string") {
        const processedOptions = {
            ...options,
            body: JSON.stringify(options.body),
        };
        return processedOptions;
    }
    return options;
};

export default checkOptions;
