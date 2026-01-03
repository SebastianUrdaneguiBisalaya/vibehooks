import * as React from 'react';

import { useScreenSize } from './useScreenSize';

export function useIsDesktop(width: number = 0) {
    const screenSize = useScreenSize();
    const [isDesktop, setIsDesktop] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsDesktop(screenSize.width >= width);
    }, [screenSize.width, width]);
    return isDesktop;
}