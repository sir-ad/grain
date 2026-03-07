import { useEffect, useRef, useCallback } from 'react';
import { createWebAdapter, type WebAdapter } from '@grain.sh/web';

export interface UseGrainOptions {
    theme?: Record<string, string>;
    onAction?: (action: string) => void;
    onEvent?: (event: string, payload: any) => void;
}

export function useGrain(containerRef: React.RefObject<HTMLElement | null>, options: UseGrainOptions = {}) {
    const adapterRef = useRef<WebAdapter | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (!adapterRef.current) {
            adapterRef.current = createWebAdapter({
                theme: options.theme,
            });

            if (options.onAction) {
                adapterRef.current.on('action', (payload: any) => options.onAction?.(payload.action));
            }
            if (options.onEvent) {
                // generic event listener map
            }
        }
    }, [containerRef, options.theme, options.onAction, options.onEvent]);

    const render = useCallback((grain: string) => {
        if (adapterRef.current && containerRef.current) {
            adapterRef.current.render(grain, { container: containerRef.current });
        }
    }, [containerRef]);

    return { render, adapter: adapterRef.current };
}
