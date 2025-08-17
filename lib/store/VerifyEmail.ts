import { create } from "zustand";

type VerifyEmailState = {
	email: string | null;
	setEmail: (email: string | null) => void;
	clearEmail: () => void;
};

export const useVerifyEmail = create<VerifyEmailState>((set) => ({
	email: null,
	setEmail: (email) => set({ email }),
	clearEmail: () => set({ email: null }),
}));
