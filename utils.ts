/**
 * Delay to avoid rate limiting
 * @param ms
 */
export const delay = async (ms: number) => {
    await new Promise(resolve => setTimeout(resolve, ms));
}
