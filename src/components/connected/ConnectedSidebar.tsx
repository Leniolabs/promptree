import {
  Sidebar,
  SidebarSection,
  SidebarLinkInstance,
  SidebarLinkTemplate,
} from "@/components/layout";
import { useInstances } from "@/query/useInstances";
import { useTemplates } from "@/query/useTemplates";
import { useRouter } from "next/router";
import React from "react";

export default function ConnectedSidebar() {
  const {
    data: instances,
    deleteAsync: deleteInstanceAsync,
    updateAsync: updateInstanceAsync,
  } = useInstances();
  const {
    data: templates,
    deleteAsync: deleteTemplateAsync,
    updateAsync: updateTemplateAsync,
  } = useTemplates();

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
      router.push("/instance");
    },
    [deleteInstanceAsync]
  );

  const handleTemplateSave = React.useCallback(
    (...args: Parameters<typeof updateTemplateAsync>) => {
      updateTemplateAsync(...args);
    },
    [updateTemplateAsync]
  );

  const handleTemplateDelete = React.useCallback(
    (...args: Parameters<typeof deleteTemplateAsync>) => {
      deleteTemplateAsync(...args);
      router.push("/template");
    },
    [deleteTemplateAsync]
  );

  return (
    <Sidebar>
      <SidebarSection
        title={"Instances"}
        onNewItemClick={() => {
          router.push("/instance");
        }}
      >
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
      <SidebarSection
        title={"Templates"}
        onNewItemClick={() => {
          router.push("/template");
        }}
      >
        {(templates || []).map((template) => (
          <SidebarLinkTemplate
            key={template.id}
            id={template.id}
            onDelete={handleTemplateDelete}
            onSave={(title) => handleTemplateSave(template.id, { title })}
            label={`${template.title} (${template.type})`}
          />
        ))}
      </SidebarSection>
    </Sidebar>
  );
}
