import { create } from "zustand";
import { persist } from "zustand/middleware";

type ApiKeyState = {
	apiKey: string | null;
	setApiKey: (key: string | null) => void;
	clearApiKey: () => void;
};

export const useApiKeyStore = create<ApiKeyState>()(
	persist(
		(set, get) => ({
			apiKey: null,
			setApiKey: (key) => {
				const now = Date.now();
				const expiresAt = now + 60 * 60 * 1000;
				set({ apiKey: key });

				localStorage.setItem("api-key-expiry", expiresAt.toString());
			},
			clearApiKey: () => {
				set({ apiKey: null });
				localStorage.removeItem("api-key-expiry");
			},
		}),
		{
			name: "api-key-storage",
		},
	),
);
