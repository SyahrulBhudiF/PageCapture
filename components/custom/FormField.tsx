"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
	id: string;
	name: string;
	label: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
	id,
	name,
	label,
	type = "text",
	placeholder,
	required,
	error,
	onChange,
}: FormFieldProps) {
	return (
		<Label htmlFor={id} className="text-md flex flex-col gap-2">
			<p className="text-start w-full">{label}</p>
			<Input
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				required={required}
				onChange={onChange}
				className="shadow-xl py-6"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</Label>
	);
}
