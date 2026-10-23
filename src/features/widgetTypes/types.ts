export interface WidgetType {
    id: number;
    slug: string;
    display_name: string;
    description: string | null;
    cost: number;
    icon_url: string | null;
    theme_color: string | null;
    href: string | null;
    availability: "hide" | "inactive" | "whitelist_only" | "active";
    created_at: string;
    updated_at: string;
}

export interface WidgetTypeFormValues {
    slug: string;
    display_name: string;
    description: string;
    cost: number;
    icon_url: string;
    theme_color: string;
    href: string;
    availability: "hide" | "inactive" | "whitelist_only" | "active";
}

export const EMPTY_WIDGET_TYPE_FORM: WidgetTypeFormValues = {
    slug: "",
    display_name: "",
    description: "",
    cost: 1,
    icon_url: "",
    theme_color: "",
    href: "",
    availability: "active",
};
