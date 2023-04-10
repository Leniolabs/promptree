import { InstanceResponse, InstanceListResponse, IInstance } from "@/types/api";
import { Instance } from "@prisma/client";
import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

async function fetchInstances() {
  const res = await axios.get<InstanceListResponse>("/api/instances");
  return res.data;
}

async function fetchInstance(id: Instance["id"]) {
  const res = await axios.get<InstanceResponse>(`/api/instances/${id}`);
  return res.data;
}

async function createInstance(obj: Omit<IInstance, "id">) {
  const res = await axios.post<InstanceResponse>("/api/instances", obj);
  return res.data;
}

async function updateInstance(
  id: Instance["id"],
  obj: Partial<Omit<IInstance, "id">>
) {
  const res = await axios.patch<InstanceResponse>(`/api/instances/${id}`, obj);
  return res.data;
}

async function deleteInstance(id: IInstance["id"]) {
  const res = await axios.delete<{}>(`/api/instances/${id}`);
  return res.data;
}

export function useInstances() {
  const queryClient = useQueryClient();

  const { isLoading, error, data, ...rest } = useQuery("fetch-instances", () =>
    fetchInstances()
  );

  const createAsync = React.useCallback(
    async (...args: Parameters<typeof createInstance>) => {
      const newInstance = await createInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      return newInstance;
    },
    [queryClient]
  );

  const updateAsync = React.useCallback(
    async (...args: Parameters<typeof updateInstance>) => {
      const updatedInstance = await updateInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  const deleteAsync = React.useCallback(
    async (...args: Parameters<typeof deleteInstance>) => {
      const deletedInstance = await deleteInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      return deletedInstance;
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

export function useInstance(id: Instance["id"]) {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(
    `fetch-instance-${id}`,
    async () => {
      if (id) return fetchInstance(id);
      return null;
    }
  );

  const updateLocal = React.useCallback(
    (obj: Partial<Omit<IInstance, "id">>) => {
      queryClient.setQueryData<typeof data>(
        `fetch-instance-${id}`,
        (oldData) => {
          if (oldData && obj)
            return {
              ...oldData,
              ...obj,
            };
          return data;
        }
      );
    },
    [queryClient, data]
  );

  const updateAsync = React.useCallback(
    async (...args: Parameters<typeof updateInstance>) => {
      const updatedInstance = await updateInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  return {
    isLoading,
    error,
    data: data || undefined,
    updateAsync,
    updateLocal,
  };
}
