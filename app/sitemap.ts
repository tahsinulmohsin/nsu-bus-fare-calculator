import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

/* One page, one canonical URL. Section anchors (#routes, #faq) are not
   separate URLs, so they are not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", SITE_URL).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [new URL("/opengraph-image.jpg", SITE_URL).toString()],
    },
  ];
}
