import { getImage } from "~/server/queries";
import { Modal } from "./modal";
import FullPageImageView from "~/app/components/full-image-page";

export default async function PhotoModal({
    params,
}:{
    params: {
        id: string;
    };
}) {
   const photoId = (await params).id;
    return (
        
        <div className="flex h-full min-h-0 w-full min-w-0 overflow-y-hidden">
        <Modal>
            <FullPageImageView photoId={photoId} />
        </Modal>
        </div>
    );
}