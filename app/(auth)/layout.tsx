"use client";

import type React from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();

	return (
		<main className="w-screen h-screen flex flex-col bg-white">
			<header className="py-8">
				<div className="w-full max-w-7xl mx-auto px-4">
					<p className="font-bold text-base">Page Capture</p>
				</div>
			</header>

			<div className="flex-1 flex justify-center items-center px-4 pb-8">
				<div className="flex w-full max-w-7xl shadow-xl rounded-xl h-[80vh] max-h-xl">
					<div className="flex flex-col w-full p-6 md:p-8">
						<ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => router.back()} />
						{children}
					</div>

					<div className="hidden md:block overflow-hidden w-full h-full relative bg-black rounded-r-xl ">
						<div className="h-full flex flex-col justify-between p-8 relative z-10">
							<p className="text-5xl font-bold text-start text-white">
								See website <br /> with Different <br /> Dimension
							</p>
							<p className="text-5xl font-bold text-end text-white">
								Something <br /> you’ve never <br /> seen before
							</p>
						</div>
						<Image
							src="/img/auth-block.svg"
							fill
							alt="Page Capture block"
							className="object-fill absolute bottom-0 z-0"
							priority
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
