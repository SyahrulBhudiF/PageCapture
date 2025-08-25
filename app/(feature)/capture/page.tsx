"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyUrl } from "@/lib/store/UrlState";
import { Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { urlSchema } from "@/lib/schema/capture";
import { toast } from "sonner";
import { useApiKeyStore } from "@/lib/store/ApiKey";

export default function Page() {
	const { setUrl } = useVerifyUrl();
	const { apiKey } = useApiKeyStore();
	const router = useRouter();

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const parse = urlSchema.safeParse(event.currentTarget.value);

			if (!parse.success) {
				toast.warning("Invalid URL");
				event.currentTarget.value = "";
				return;
			}

			if (!apiKey) {
				toast.warning("API key is required");
				event.currentTarget.value = "";

				setTimeout(() => {
					router.push("/apiKey");
				}, 1500);
				return;
			}

			setUrl(event.currentTarget.value);
			router.push("/capture/options");
		}
	};

	return (
		<section className="relative flex flex-col items-center justify-center min-h-[60vh] w-full bg-black">
			<div className="absolute inset-0 w-full h-full hidden md:block">
				<div className="absolute -left-13 w-[60%] h-full">
					<Image
						src="/img/left.svg"
						alt="Left"
						fill
						className="object-contain object-left-bottom"
						priority
					/>
				</div>
				<div className="absolute -right-10 w-[60%] h-full">
					<Image
						src="/img/right.svg"
						alt="Right"
						fill
						className="object-contain object-right-top"
						priority
					/>
				</div>
			</div>

			<div className="relative z-10 flex flex-col items-center justify-center gap-6 w-full max-w-2xl px-4 text-center">
				<h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">PageCapture</h1>
				<p className="text-white text-lg sm:text-xl md:text-2xl">Test your responsiveness here</p>

				<Label
					htmlFor="url"
					className="w-full bg-white rounded-lg shadow-md flex items-center px-4"
				>
					<Input
						type="text"
						name="url"
						id="url"
						placeholder="Paste your url here..."
						className="py-4 sm:py-5 md:py-6 px-3 w-full rounded-lg border-none focus:!outline-none focus:!ring-0 focus:!ring-transparent focus:!border-transparent focus-visible:!ring-0 focus-visible:!ring-transparent focus-visible:!border-transparent"
						onKeyDown={handleKeyDown}
					/>
					<Link className="text-gray-400" />
				</Label>

				<button className="flex items-center cursor-pointer gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white shadow-md text-sm sm:text-base md:text-lg">
					<History />
					Conversion History
				</button>
			</div>
		</section>
	);
}
