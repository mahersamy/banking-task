import { Routes } from "@angular/router";
import { NavItem } from "../layout/models/nav-item.interface";

export function extractSidebarItems(routes: Routes, parentPath = ""): NavItem[] {
    const items: NavItem[] = [];

    for (const route of routes) {
        const segment = route.path ?? "";
        const fullPath = `${parentPath}/${segment}`.replace(/\/+/g, "/");

        if (route.data?.["sidebar"]) {
            items.push({
                label:      route.data["label"] ?? segment,
                icon:       route.data["icon"]  ?? "",
                iconWidth:  route.data["iconWidth"],
                iconHeight: route.data["iconHeight"],
                alt:        (route.data["label"] ?? segment)?.toLowerCase(),
                route:      fullPath,
            });
        }

        // Recursively check children
        if (route.children) {
            items.push(...extractSidebarItems(route.children, fullPath));
        }
    }

    return items;
}

