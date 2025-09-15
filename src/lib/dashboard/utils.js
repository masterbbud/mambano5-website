export function weekFromDate(date) {
    // @ts-ignore
    return Math.floor((date - new Date("9/2/2025")) / (1000 * 60 * 60 * 24 * 7));
}

export function dayFromDate(date) {
    // @ts-ignore
    return Math.floor((date - new Date("9/2/2025")) / (1000 * 60 * 60 * 24));
}