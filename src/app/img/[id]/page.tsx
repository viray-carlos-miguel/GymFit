import FullPageImageView from "~/app/components/full-image-page";
import { getImage } from "~/server/queries";
export default async function PhotoModal({
    params,
}:{
    params: {
        id: string;
    };
}) {
    const photoId = (await params).id;
   return(
   <div>
    {/* <img src={image.url} alt={image.name} className="w-96"/>  */}
    <FullPageImageView photoId={photoId}/>
    </div>
    
   );
}