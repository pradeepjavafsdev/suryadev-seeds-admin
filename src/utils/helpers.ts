// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/utils/helpers.ts

export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};