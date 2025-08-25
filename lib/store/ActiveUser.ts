import { create } from "zustand";
import { User } from "../model/user";
import { persist } from "zustand/middleware";

type UserState = {
	user: Partial<User> | null;
	setUser: (user: Partial<User> | null) => void;
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
		}),
		{
			name: "user-storage",
		},
	),
);
