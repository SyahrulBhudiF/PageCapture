"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps {
	id: string;
	name: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	error?: string;
}

export function PasswordInput({
	id,
	name,
	label,
	placeholder,
	required,
	error,
}: PasswordInputProps) {
	const [state, setState] = useState<boolean>(false);

	return (
		<Label htmlFor={id} className="text-md flex flex-col gap-2">
			<p className="text-start w-full">{label}</p>
			<div className="relative w-full">
				<Input
					id={id}
					name={name}
					type={state ? "text" : "password"}
					placeholder={placeholder}
					required={required}
					className="shadow-xl py-6 w-full"
				/>
				<div className="absolute inset-y-0 right-0 pr-5 w-fit flex items-center">
					{state ? (
						<EyeIcon
							className="w-5 h-5 text-gray-500 cursor-pointer"
							onClick={() => setState(false)}
						/>
					) : (
						<EyeOffIcon
							className="w-5 h-5 text-gray-500 cursor-pointer"
							onClick={() => setState(true)}
						/>
					)}
				</div>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</Label>
	);
}
