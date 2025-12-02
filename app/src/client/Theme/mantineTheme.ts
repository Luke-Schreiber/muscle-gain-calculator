import { createTheme, rem } from '@mantine/core';

export const mantineTheme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Inter, sans-serif',
    headings: {
        fontFamily: 'Inter, sans-serif',
    },
});

export const DEFAULT_DATA_COLOR = '#228be6';
export const smallHoverColor = '#1c7ed6';
export const smallSelectColor = '#1971c2';

export const useThemeConstants = () => {
    return {
        buttonIconSize: rem(16),
        cardIconSize: rem(20),
        cardIconStroke: 1.5,
        toolbarWidth: 60,
        iconStroke: 1.5,
    };
};
