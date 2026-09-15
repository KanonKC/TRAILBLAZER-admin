export interface WidgetType {
    id: number;
    slug: string;
    display_name: string;
    description: string | null;
    cost: number;
    icon_url: string | null;
    theme_color: string | null;
    href: string | null;
    is_active: boolean;
    is_display: boolean;
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
    is_active: boolean;
    is_display: boolean;
}

export const EMPTY_WIDGET_TYPE_FORM: WidgetTypeFormValues = {
    slug: "",
    display_name: "",
    description: "",
    cost: 1,
    icon_url: "",
    theme_color: "",
    href: "",
    is_active: true,
    is_display: true,
};
