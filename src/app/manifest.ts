import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amir Islamic Collections",
    short_name: "Amir Islamic",
    description: "Premium Islamic Products Marketplace — Prayer mats, Qur'an, hijabs, perfumes, and more. Shop with faith and confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle", "religion", "islamic"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Start Shopping",
        short_name: "Shop",
        description: "Browse our Islamic products",
        url: "/",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "View Orders",
        short_name: "Orders",
        description: "Track your orders",
        url: "/account/orders",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Wishlist",
        short_name: "Wishlist",
        description: "View your saved items",
        url: "/wishlist",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
    screenshots: [],
  };
}
