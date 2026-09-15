export const CDN_ORIGIN = process.env.NEXT_PUBLIC_CDN_ORIGIN ?? "";
export const WIDGET_ICONS_PREFIX = `${CDN_ORIGIN}/widget-icons/`;

export function defaultHrefForSlug(slug: string): string {
    return `/dashboard/widgets/${slug}`;
}

export function defaultIconFilenameForSlug(slug: string): string {
    return `${slug}.svg`;
}

/** Splits a full icon_url into the editable filename, if it matches the current CDN's widget-icons/ prefix. */
export function extractIconFilename(iconUrl: string): string {
    if (iconUrl.startsWith(WIDGET_ICONS_PREFIX)) {
        return iconUrl.slice(WIDGET_ICONS_PREFIX.length);
    }
    return "";
}

export function buildIconUrl(filename: string): string {
    return filename ? `${WIDGET_ICONS_PREFIX}${filename}` : "";
}
