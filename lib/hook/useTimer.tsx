import { useEffect, useState, useCallback } from "react";

export default function useTimer(_initial = 0, key = "otp-timer") {
	const [timer, setTimer] = useState<number>(() => {
		const stored = localStorage.getItem(key);
		if (stored) {
			const endTime = parseInt(stored, 10);
			return Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
		}
		return 0;
	});

	const start = useCallback(
		(seconds: number) => {
			const endTime = Date.now() + seconds * 1000;
			localStorage.setItem(key, endTime.toString());
			setTimer(seconds);
		},
		[key],
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const stored = localStorage.getItem(key);

			if (!stored) {
				setTimer((currentTimer) => (currentTimer > 0 ? 0 : currentTimer));
				return;
			}

			const endTime = parseInt(stored, 10);
			const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);

			if (remaining <= 0) {
				localStorage.removeItem(key);
			}

			setTimer(remaining);
		}, 1000);

		return () => clearInterval(interval);
	}, [key]);

	return { timer, start };
}
