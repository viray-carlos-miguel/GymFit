// components/UploadButton.tsx
"use client";


import { useCallback } from "react";
import { useUploadThing } from "~/utils/uploadthing";

export function UploadButton({
    onSuccess,
    className
}: {
    onSuccess: (url: string) => void;
    className?: string;
}) {
    const { startUpload } = useUploadThing("imageUploader");

    const handleUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                startUpload(Array.from(e.target.files)).then((res) => {
                    if (res?.[0]?.url) {
                        onSuccess(res[0].url);
                    }
                });
            }
        },
        [startUpload, onSuccess]
    );

    return (
        <label className={`cursor-pointer ${className}`}>
            <span className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors block text-center">
                Upload Photo
            </span>
            <input type="file" className="hidden" onChange={handleUpload} />
        </label>
    );
}