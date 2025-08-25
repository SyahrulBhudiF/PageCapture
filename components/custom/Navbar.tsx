"use client";

import { User } from "@/lib/model/user";
import { type ActiveMenu, useActiveMenu } from "@/lib/store/ActiveMenu";
import { useUserStore } from "@/lib/store/ActiveUser";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const NavBar = ({ userData }: { userData?: Partial<User> | null }) => {
	const { setUser } = useUserStore();
	const { activeMenu, setActiveMenu } = useActiveMenu();
	const pathname = usePathname();

	useEffect(() => {
		if (userData) setUser(userData);
	}, [userData, setUser]);

	const menuClass = (menu: string) =>
		cn(
			"px-4 py-2 rounded-full transition duration-300 ease-in-out",
			activeMenu === menu
				? "bg-white shadow-xl text-black"
				: pathname === "/capture"
					? "text-white"
					: "text-black",
		);

	const menus: { key: ActiveMenu; label: string }[] = [
		{ key: "apiKey", label: "Api Key" },
		{ key: "capture", label: "Capture" },
	];

	return (
		<header
			className={cn("p-4 flex justify-around w-full z-20 isolate", {
				"bg-transparent absolute top-0": pathname === "/capture",
				"bg-white": pathname !== "/capture",
			})}
		>
			<p className="font-bold text-base text-white mix-blend-difference">Page Capture</p>

			<nav>
				<ul className="flex space-x-4">
					{menus.map((menu) => (
						<li key={menu.key} onClick={() => setActiveMenu(menu.key)} className="cursor-pointer">
							<a href={`/${menu.key}`} className={menuClass(menu.key)}>
								{menu.label}
							</a>
						</li>
					))}
				</ul>
			</nav>

			{userData && (
				<div className="text-white mix-blend-difference z-10">Hello, {userData.name}</div>
			)}
		</header>
	);
};
