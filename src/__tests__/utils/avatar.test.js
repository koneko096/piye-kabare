import { getAvatarUrl } from '../../utils/avatar';

describe('avatar utility', () => {
    it('should return a valid avatar URL with default values', () => {
        const name = 'John Doe';
        const url = getAvatarUrl(name);
        expect(url).toContain('ui-avatars.com');
        expect(url).toContain('name=John%20Doe');
        expect(url).toContain('background=random');
    });

    it('should return a valid avatar URL with custom colors', () => {
        const name = 'Jane';
        const url = getAvatarUrl(name, '000', 'fff');
        expect(url).toContain('background=000');
        expect(url).toContain('color=fff');
    });

    it('should handle undefined name gracefully', () => {
        const url = getAvatarUrl(undefined);
        expect(url).toContain('name=User');
    });
});
