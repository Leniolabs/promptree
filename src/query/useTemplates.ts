import { TemplateResponse, TemplateListResponse, ITemplate } from "@/types/api";
import { Template } from "@prisma/client";
import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

async function fetchTemplates() {
  const res = await axios.get<TemplateListResponse>("/api/templates");
  return res.data;
}

async function fetchTemplate(id: Template["id"]) {
  const res = await axios.get<TemplateResponse>(`/api/templates/${id}`);
  return res.data;
}

async function createTemplate(obj: Omit<ITemplate, "id">) {
  const res = await axios.post<TemplateResponse>("/api/templates", obj);
  return res.data;
}

async function updateTemplate(
  id: Template["id"],
  obj: Partial<Omit<ITemplate, "id">>
) {
  const res = await axios.put<TemplateResponse>(`/api/templates/${id}`, obj);
  return res.data;
}

async function deleteTemplate(id: ITemplate["id"]) {
  const res = await axios.delete<{}>(`/api/templates/${id}`);
  return res.data;
}

export function useTemplates() {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery("fetch-templates", () =>
    fetchTemplates()
  );

  const createAsync = React.useCallback(
    async (...args: Parameters<typeof createTemplate>) => {
      const newTemplate = await createTemplate(...args);
      await queryClient.invalidateQueries("fetch-templates");
      return newTemplate;
    },
    [queryClient]
  );

  const updateAsync = React.useCallback(
    async (...args: Parameters<typeof updateTemplate>) => {
      const updatedTemplate = await updateTemplate(...args);
      await queryClient.invalidateQueries("fetch-templates");
      await queryClient.invalidateQueries(`fetch-template-${args[0]}`);
      return updatedTemplate;
    },
    [queryClient]
  );

  const deleteAsync = React.useCallback(
    async (...args: Parameters<typeof deleteTemplate>) => {
      const deletedTemplate = await deleteTemplate(args[0]);
      await queryClient.invalidateQueries("fetch-templates");
      return deletedTemplate;
    },
    [queryClient]
  );

  return {
    isLoading,
    error,
    data: data || undefined,
    createAsync,
    updateAsync,
    deleteAsync,
  };
}

export function useTemplate(id?: ITemplate["id"]) {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(`fetch-template-${id}`, () => {
    if (id) return fetchTemplate(id);
    return null;
  });

  const updateAsync = React.useCallback(
    async (...args: Parameters<typeof updateTemplate>) => {
      const updatedTemplate = await updateTemplate(...args);
      await queryClient.invalidateQueries("fetch-templates");
      await queryClient.invalidateQueries(`fetch-template-${args[0]}`);
      return updatedTemplate;
    },
    [queryClient]
  );

  return {
    isLoading,
    error,
    data: data || undefined,
    updateAsync,
  };
}
