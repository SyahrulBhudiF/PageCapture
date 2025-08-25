import { create } from "zustand";

type VerifyUrlState = {
	url: string | null;
	setUrl: (url: string | null) => void;
	clearUrl: () => void;
};

export const useVerifyUrl = create<VerifyUrlState>((set) => ({
	url: null,
	setUrl: (url) => set({ url }),
	clearUrl: () => set({ url: null }),
}));
