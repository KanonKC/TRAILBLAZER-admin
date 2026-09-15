import { apiClient } from "@/lib/api-client";
import { WidgetType, WidgetTypeFormValues } from "@/features/widgetTypes/types";

export const listWidgetTypes = async (): Promise<WidgetType[]> => {
    const response = await apiClient.get<{ data: WidgetType[] }>("/api/v1/widget-types");
    return response.data.data;
};

export const createWidgetType = async (payload: WidgetTypeFormValues): Promise<WidgetType> => {
    const response = await apiClient.post<WidgetType>("/api/v1/admin/widget-types", payload);
    return response.data;
};

export const updateWidgetType = async (id: number, payload: WidgetTypeFormValues): Promise<WidgetType> => {
    const response = await apiClient.put<WidgetType>(`/api/v1/admin/widget-types/${id}`, payload);
    return response.data;
};

export const deleteWidgetType = async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/widget-types/${id}`);
};

export const uploadWidgetTypeIcon = async (filename: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    // The backend's multipart parser is a stream — it only sees fields that
    // appeared earlier in the form, so `filename` must be appended before `file`.
    formData.append("filename", filename);
    formData.append("file", file);

    const response = await apiClient.post<{ url: string }>("/api/v1/admin/widget-types/upload-icon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
