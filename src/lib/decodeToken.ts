export function getPublicId(token: string): string {
    return JSON.parse(atob(token.split(".")[1])).uid;
}