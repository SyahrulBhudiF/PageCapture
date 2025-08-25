import { NavBar } from "@/components/custom/Navbar";
import { getUser } from "./action";

export default async function ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getUser();

	console.log("User in layout1:", user);

	return (
		<main className="w-screen h-screen flex flex-col bg-white relative">
			<NavBar userData={user?.success ? user.data : null} />
			{children}
		</main>
	);
}
