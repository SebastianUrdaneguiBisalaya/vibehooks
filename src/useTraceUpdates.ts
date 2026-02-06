import * as React from 'react';

/**
 * `useTraceUpdates` is a React hook that logs all updates to the component tree.
 * It is useful for debugging with React DevTools.
 * It is only recommended for development purposes.
 *
 * @example
 * ```tsx
 * // Trace state changes
 * function Counter() {
 *   const [count, setCount] = React.useState(0);
 *   const [step, setStep] = React.useState(1);
 *
 *   useTraceUpdates({ count }, 'Counter.count');
 *
 *   return <button onClick={() => setCount(c => c + step)} />;
 * }
 * ```
 */
export function useTraceUpdates(value: Record<string, unknown>, name?: string) {
	const prev = React.useRef<Record<string, unknown> | null>(null);

	React.useEffect(() => {
		if (prev.current) {
			const changes: Record<string, { from: unknown; to: unknown }> = {};
			for (const key in value) {
				if (prev.current[key] !== value[key]) {
					changes[key] = {
						from: prev.current[key],
						to: value[key],
					};
				}
			}
			if (Object.keys(changes).length > 0) {
				console.log(
					`[useTraceUpdates] ${name ?? 'Component'} changes:`,
					changes
				);
			}
		}
		prev.current = value;
	}, [value, name]);
}
