export const maskPassport = (value = '') => {
    const last4 = value.slice(-4);
    return `XXXX-XXXX-${last4}`;
};
