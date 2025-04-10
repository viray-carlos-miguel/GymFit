import Link from "next/link";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import Image from "next/image";
import NotificationHandler from "./components/notification-handler";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {images.length > 0 ? (
        images.map((image) => (
          <div key={image.id} className="flex flex-col items-center">
            <Link href={`/img/${image.id}`} className="group">
            <div className="relative aspect-video bg-zinc-900 ">
                <Image
                  src={image.url}
                  style={{ objectFit: "cover" , objectPosition: "top"}}
                  width={200}
                  height={200}
                  className="rounded-lg shadow-md transition-transform group-hover:scale-105"
                  alt={image.name}
                />
            </div>

            </Link>
            <div className="mt-2 text-center text-lg font-semibold text-gray-700">{image.name}</div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No images uploaded yet. Start by adding your favorite pet photos!</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">🐾 Welcome to the Pet Gallery! 🐾</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        A place to share and cherish memories of your adorable pets. Upload your favorite moments and explore others'!
      </p>

      <SignedOut>
        <div className="text-xl text-gray-600">Please sign in to view or upload images.</div>
      </SignedOut>

      <SignedIn>
        <NotificationHandler/>
        <Images />
      </SignedIn>
    </main>
  );
}