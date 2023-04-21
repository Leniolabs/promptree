import { SidebarSection, SidebarLinkInstance } from "@/components/layout";
import { useInstances } from "@/query/useInstances";
import { useRouter } from "next/router";
import React from "react";

export function ConnectedInstancesList() {
  const {
    data: instances,
    deleteAsync: deleteInstanceAsync,
    updateAsync: updateInstanceAsync,
  } = useInstances();

  const router = useRouter();

  const handleInstanceSave = React.useCallback(
    (...args: Parameters<typeof updateInstanceAsync>) => {
      updateInstanceAsync(...args);
    },
    [updateInstanceAsync]
  );

  const handleInstanceDelete = React.useCallback(
    (...args: Parameters<typeof deleteInstanceAsync>) => {
      deleteInstanceAsync(...args);
      router.push("/");
    },
    [deleteInstanceAsync]
  );

  return (
    <SidebarSection>
      {(instances || []).map((instance) => (
        <SidebarLinkInstance
          key={instance.id}
          id={instance.id}
          onDelete={handleInstanceDelete}
          onSave={(title) => handleInstanceSave(instance.id, { title })}
          label={instance.title}
        />
      ))}
    </SidebarSection>
  );
}
