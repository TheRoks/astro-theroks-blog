import type { ComponentProps } from "astro/types";

// With Content Layer API, we use the render() function which returns { Content, headings, remarkPluginFrontmatter }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostContentComponent = ComponentProps<any>;

// Image type from Astro's image() helper
export interface AstroImage {
  src: string;
  width: number;
  height: number;
  format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
}

export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  updateDate?: Date;
  title: string;
  description?: string;

  // Updated to support both string URLs and Astro's optimized images
  image?: string | AstroImage;

  canonical?: string | URL;
  permalink?: string;

  draft?: boolean;

  excerpt?: string;
  category?: string;
  tags?: Array<string>;
  author?: string;

  Content: PostContentComponent;
  content?: string;
}

export interface MetaSEO {
  title?: string;
  description?: string;
  image?: string;

  canonical?: string | URL;
  noindex?: boolean;
  nofollow?: boolean;

  ogTitle?: string;
  ogType?: string;

  // For structured data (JSON-LD)
  post?: Post;
  updateDate?: Date;
}
