import { ThumbSizes } from '../config';
import { ImageDto } from '../dto';
import { ImageRv } from '../rv';

type mapImageFunctionType = {
  (image: ImageRv, defaultUrl?: string): ImageDto;
  (images: ImageRv[], defaultUrl?: string): ImageDto[];
};

export const mapImageToDto: mapImageFunctionType = function (imageOrImages?: ImageRv | ImageRv[], defaultUrl?: string): ImageDto & ImageDto[] {
  const isArray: boolean = Array.isArray(imageOrImages);
  const images: ImageRv[] = imageOrImages as ImageRv[];
  return (isArray ? mapArrayToDto(images, defaultUrl) : mapSingleToDto(imageOrImages as ImageRv, defaultUrl)) as ImageDto & ImageDto[];
};

function mapArrayToDto(images: ImageRv[], defaultUrl?: string): ImageDto[] {
  return defaultUrl && images.length === 0 ? [mapSingleToDto(null, defaultUrl)] : images.map((image: ImageRv) => mapSingleToDto(image, defaultUrl));
}

function mapSingleToDto(image: ImageRv, defaultUrl?: string): ImageDto {
  if (!image?.url && defaultUrl) {
    return {
      url: defaultUrl,
      thumbs: ThumbSizes.map((size: number) => ({
        size,
        thumbUrl: defaultUrl,
      })),
    };
  }

  if (!image?.url && !defaultUrl) {
    return null;
  }

  return {
    url: image.url,
    thumbs: ThumbSizes.map((size: number) => ({
      size,
      thumbUrl: image.id ? [image.serverUrl, image.path, image.id, `${size}.${image.ext}`].join('/') : image.url,
    })),
  };
}
