/**
 * Represents a single item in the sidebar navigation list.
 *
 * `iconWidth` and `iconHeight` are required by Angular's `NgOptimizedImage`
 * directive to prevent layout shift — they must match the intrinsic pixel
 * dimensions of the image file.
 */
export interface NavItem {
    /** Display text shown next to the icon */
    label: string;

    /** FontAwesome icon class (e.g. 'fa-solid fa-house') or path to image */
    icon: string;

    /** Intrinsic pixel width of the icon (if using images) */
    iconWidth?: number;

    /** Intrinsic pixel height of the icon (if using images) */
    iconHeight?: number;

    /** Alt text for the icon (usually label lowercased) */
    alt: string;

    /** Absolute router path this item navigates to (e.g. /main/staff) */
    route: string;
}
