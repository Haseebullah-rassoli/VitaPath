// GitHub Pages serves static directories; use canonical document URLs.
export const basePath = process.env.NODE_ENV === "production" ? "/VitaPath" : "";
export const templateHref = (id: string) => `${basePath}/builder/?template=${encodeURIComponent(id)}`;
