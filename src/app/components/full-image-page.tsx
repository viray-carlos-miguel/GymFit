import { clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { deleteImage, getImage } from "~/server/queries";

export default async function FullPageImageView(props: { photoId: string }) {
    const idAsNumber = Number(props.photoId);
    if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");

    const image = await getImage(idAsNumber);
    const uploaderInfo = await (await clerkClient()).users.getUser(image.userId);

    return (
        <div className="flex h-full w-full min-w-0">
            {/* Image Section */}
            <div className="flex items-center justify-center flex-shrink-0 w-1/2 p-4">
                <img
                    src={image.url}
                    alt={image.name}
                    className="h-auto max-h-[90%] object-contain"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col w-1/2 border-2 p-4">
                <div className="border-b p-2 text-center text-lg">{image.name}</div>
                <div className="flex flex-col p-2">
                    <span>Uploaded By:</span>
                    <span>{uploaderInfo.fullName}</span>
                </div>
                <div className="flex flex-col p-2">
                    <span>Created At:</span>
                    <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="p-2 mt-4">
                    <form
                        action={async () => {
                            "use server";
                            await deleteImage(idAsNumber);
                        }}
                    >
                        <Button type="submit" variant="destructive">
                            Delete
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
