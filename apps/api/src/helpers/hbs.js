export const helpers = {
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },
    eq(a, b) {
        return a === b;
    },
    capitalize(str) {
        if (!str) return '-';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    currency(num) {
        if (!num) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
    },
    poolFishCountFormatter(num) {
        if (!num) return '-';
        if (num < 1) return '-'
        return num
    },
};