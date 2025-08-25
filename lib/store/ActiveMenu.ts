import { create } from "zustand";

export type ActiveMenu = "apiKey" | "capture";

type ActiveMenuState = {
	activeMenu: ActiveMenu;
	setActiveMenu: (menu: ActiveMenu) => void;
};

export const useActiveMenu = create<ActiveMenuState>((set) => ({
	activeMenu: "capture",
	setActiveMenu: (menu) => set({ activeMenu: menu }),
}));
