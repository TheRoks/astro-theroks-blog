type ImageModule = Record<string, () => Promise<unknown>>;

const load = async function (): Promise<ImageModule | undefined> {
  let images: ImageModule | undefined = undefined;
  try {
    images = import.meta.glob("~/assets/images/**");
  } catch {
    // continue regardless of error
  }
  return images;
};

let _images: Promise<ImageModule | undefined> | undefined;

/** */
export const fetchLocalImages = async (): Promise<ImageModule | undefined> => {
  _images = _images || load();
  return await _images;
};

/** */
export const findImage = async (imagePath?: string): Promise<string | null> => {
  if (typeof imagePath !== "string") {
    return null;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (!imagePath.startsWith("~/assets")) {
    return null;
  } // For now only consume images using ~/assets alias (or absolute)

  const images = await fetchLocalImages();
  if (!images) {
    return null;
  }

  const key = imagePath.replace("~/", "/src/");

  if (typeof images[key] === "function") {
    const imageModule = (await images[key]()) as { default: string };
    return imageModule.default;
  }

  return null;
};
