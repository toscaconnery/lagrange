export function capitalize(str) {
    if (!str) return '-';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatDate = (date) => {
    if (date === null) {
        return '-'
    }

    const dateObj = new Date(date)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
    return formattedDate
}

export const generateFormattedDateForFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`
}