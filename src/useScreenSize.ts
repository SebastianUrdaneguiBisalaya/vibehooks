import * as React from 'react';

export type ScreenSize = {
    width: number;
    height: number;
}

export function useScreenSize() {
    const [size, setSize] = React.useState<ScreenSize>({
        height: 0,
        width: 0,
    });
    React.useEffect(() => {
        const handleResize = () => {
            setSize({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    return size;
}