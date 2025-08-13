import React from "react";
import {ChevronLeft} from "lucide-react";
import Image from "next/image";

export default function ({
                             children,
                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-screen py-8 px-[30vh] border">
            <p className="font-bold text-base">Page Capture</p>
            <div className="flex flex-col justify-center h-full">
                <div className="flex gap-10 shadow-xl rounded-xl pl-6 h-[80vh]">
                    <div className="flex flex-col gap-6 w-full py-6">
                        <ChevronLeft className="w-6 h-6"/>
                        {children}
                    </div>

                    <div className="w-full h-full relative">
                        <Image
                            src="/img/banner.png"
                            fill
                            alt="Page Capture Illustration"
                            className="object-fill rounded-r-xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}
