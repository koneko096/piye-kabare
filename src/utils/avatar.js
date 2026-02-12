/**
 * Generates an avatar URL based on Name or Username.
 * @param {string} name - The name to use for the avatar.
 * @param {string} background - Optional background color (hex, no #).
 * @param {string} color - Optional text color (hex, no #).
 * @returns {string} - The avatar URL.
 */
export const getAvatarUrl = (name, background = 'random', color = 'fff') => {
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=128`;
};
