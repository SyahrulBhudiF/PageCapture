let accessToken: string | null = null;

export const tokenStore = {
    get: () => accessToken,
    set: (token: string) => {
        accessToken = token
    },
    clear: () => {
        accessToken = null
    }
};
