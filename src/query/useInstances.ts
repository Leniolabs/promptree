import { InstanceResponse, InstanceListResponse, IInstance } from "@/types/api";
import { ICheckoutOptions, IMergeOptions, IMessage } from "@/types/chat";
import { Instance } from "@prisma/client";
import axios from "axios";
import { getCsrfToken } from "next-auth/react";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

async function fetchInstances() {
  const res = await axios.get<InstanceListResponse>("/api/instances", {
    withCredentials: true,
    headers: {
      "csrf-token": await getCsrfToken(),
    },
  });
  return res.data;
}

async function deleteInstances() {
  const res = await axios.delete<InstanceResponse>(`/api/instances`, {
    withCredentials: true,
  });
  return res.data;
}

async function fetchInstance(id: Instance["id"]) {
  const res = await axios.get<InstanceResponse>(`/api/instances/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
async function createInstance(obj: Pick<IInstance, "title" | "messages">) {
  const res = await axios.post<InstanceResponse>("/api/instances", obj, {
    withCredentials: true,
  });
  return res.data;
}

async function updateInstance(
  id: Instance["id"],
  obj: Partial<Pick<IInstance, "title" | "public">>
) {
  const res = await axios.patch<InstanceResponse>(`/api/instances/${id}`, obj, {
    withCredentials: true,
  });
  return res.data;
}

async function forkInstance(id: Instance["id"]) {
  const res = await axios.post<{ id: InstanceResponse["id"] }>(
    `/api/instances/${id}/fork`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

async function addMessageInstance(
  id: Instance["id"],
  obj: { messages: IMessage[]; regenerate?: boolean; edit?: boolean }
) {
  const res = await axios.post<InstanceResponse>(
    `/api/instances/${id}/add-messages`,
    obj,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

async function checkoutInstance(id: Instance["id"], obj: ICheckoutOptions) {
  const res = await axios.post<InstanceResponse>(
    `/api/instances/${id}/checkout`,
    obj,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

async function mergeInstance(id: Instance["id"], obj: IMergeOptions) {
  const res = await axios.post<InstanceResponse>(
    `/api/instances/${id}/merge`,
    obj,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function initSquashInstance(
  id: Instance["id"],
  obj: IMergeOptions
) {
  const res = await axios.get<{ difference: IMessage[] }>(
    `/api/instances/${id}/squash-merge?fromBranch=${obj.fromBranch}&toBranch=${obj.toBranch}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function mergeSquashInstance(
  id: Instance["id"],
  obj: IMergeOptions
) {
  const res = await axios.post<InstanceResponse>(
    `/api/instances/${id}/squash-merge`,
    obj,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

async function deleteInstance(id: IInstance["id"]) {
  const res = await axios.delete<{}>(`/api/instances/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export function useCreateInstance() {
  const queryClient = useQueryClient();

  const createAsync = React.useCallback(
    async (...args: Parameters<typeof createInstance>) => {
      const newInstance = await createInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      return newInstance;
    },
    [queryClient]
  );

  return {
    createAsync,
  };
}

export function useDeleteInstances() {
  const queryClient = useQueryClient();

  const deleteAllAsync = React.useCallback(
    async (...args: Parameters<typeof deleteInstances>) => {
      const newInstance = await deleteInstances(...args);
      await queryClient.invalidateQueries("fetch-instances");
      location.href = "/";
      return newInstance;
    },
    [queryClient]
  );

  return {
    deleteAllAsync,
  };
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

  const deleteAllAsync = React.useCallback(
    async (...args: Parameters<typeof deleteInstances>) => {
      const deletedInstances = await deleteInstances(...args);
      await queryClient.invalidateQueries("fetch-instances");
      return deletedInstances;
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
    deleteAllAsync,
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

  const addMessagesAsync = React.useCallback(
    async (...args: Parameters<typeof addMessageInstance>) => {
      const updatedInstance = await addMessageInstance(...args);
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  const checkoutAsync = React.useCallback(
    async (...args: Parameters<typeof checkoutInstance>) => {
      const updatedInstance = await checkoutInstance(...args);
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  const mergeAsync = React.useCallback(
    async (...args: Parameters<typeof mergeInstance>) => {
      const updatedInstance = await mergeInstance(...args);
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  const initSquashAsync = React.useCallback(
    async (...args: Parameters<typeof initSquashInstance>) => {
      return await initSquashInstance(...args);
    },
    [queryClient]
  );

  const forkAsync = React.useCallback(
    async (...args: Parameters<typeof forkInstance>) => {
      const forkedReply = await forkInstance(...args);
      await queryClient.invalidateQueries("fetch-instances");
      return forkedReply;
    },
    [queryClient]
  );

  const mergeSquashAsync = React.useCallback(
    async (...args: Parameters<typeof mergeSquashInstance>) => {
      const updatedInstance = await mergeSquashInstance(...args);
      await queryClient.invalidateQueries(`fetch-instance-${args[0]}`);
      return updatedInstance;
    },
    [queryClient]
  );

  const refresh = React.useCallback(async () => {
    await queryClient.invalidateQueries(`fetch-instance-${id}`);
  }, [id]);

  return {
    isLoading,
    error,
    data: data || undefined,
    refresh,
    updateAsync,
    updateLocal,
    addMessagesAsync,
    checkoutAsync,
    mergeAsync,
    initSquashAsync,
    mergeSquashAsync,
    forkAsync,
  };
}
