import { clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { deleteImage, getImage } from "~/server/queries";

export default async function FullPageImageView(props: { photoId: string }) {
    const idAsNumber = Number(props.photoId);
    if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");

    const image = await getImage(idAsNumber);
    const uploaderInfo = await (await clerkClient()).users.getUser(image.userId);

    return (
        <div className="flex h-screen w-full">
            {/* Image Section */}
            <div className="w-1/2 h-full flex-shrink-0">
                <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col w-1/2 border-l p-6 ">
                <div className="border-b pb-4 text-center text-2xl font-bold text-gray-800">
                    {image.name}
                </div>

                <div className="mt-6 text-lg">
                    <p className="mb-2">
                        <span className="font-semibold">Uploaded By:</span>{" "}
                        {uploaderInfo.fullName}
                    </p>
                    <p>
                        <span className="font-semibold">Created At:</span>{" "}
                        {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-2 pt-4">
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
