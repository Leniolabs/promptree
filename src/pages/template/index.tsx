import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import ConnectedSidebar from "@/components/connected/ConnectedSidebar";
import { Template } from "@/components/layout/Template";
import { useTemplates } from "@/query/useTemplates";
import React from "react";
import { useRouter } from "next/router";

export default function TemplateView() {
  const { createAsync } = useTemplates();
  const router = useRouter();

  const handleCreate = React.useCallback(
    (...args: Parameters<typeof createAsync>) => {
      createAsync(...args).then((response) => {
        if (response?.id) {
          router.push(`/template/${response.id}`);
        }
      });
    },
    [createAsync]
  );

  return (
    <>
      <Layout>
        <ConnectedSidebar />
        <Content>
          <Template onSave={handleCreate} />
        </Content>
      </Layout>
    </>
  );
}
