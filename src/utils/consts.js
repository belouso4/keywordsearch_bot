
export const LIST_OF_ADMINS = process.env.LIST_OF_ADMINS
    .split(',')
    .map(str => parseInt(str, 10))