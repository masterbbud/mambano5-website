export function weekFromDate(date) {
    // @ts-ignore
    return Math.floor((date - new Date("9/4/2025")) / (1000 * 60 * 60 * 24 * 7));
}

export function dayFromDate(date) {
    // @ts-ignore
    return Math.floor((date - new Date("9/4/2025")) / (1000 * 60 * 60 * 24));
}

export const userToColor = {
    Anthony: '255, 28, 0',
    Brandon: '255, 90, 0',
    Catie: '0, 169, 200',
    Danny: '0, 158, 255',
    Ivan: '168, 0, 255'
}

export const submoduleToColor = {
    "Goal": "38, 209, 0",
    "Total": '255, 28, 0',
    "Login/Signup": '255, 90, 0',
    "Job": '0, 169, 200',
    "Institution": '0, 158, 255',
    "Users": '168, 0, 255'
}