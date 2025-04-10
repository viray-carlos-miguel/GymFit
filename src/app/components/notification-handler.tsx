"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationHandler() {
const searchparams = useSearchParams();
const router = useRouter();

useEffect(() => {
    if ( searchparams.get("deleted")){
        toast.success(<span className="text-lg">Image Deleted</span>);

        router.replace("/", undefined);
    }
    
}, [searchparams, router]);

return null;
}