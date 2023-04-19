import React from "react";
import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import ConnectedSidebar from "@/components/connected/ConnectedSidebar";
import { Instance } from "@/components/layout/Instance";
import { GetServerSidePropsContext } from "next";
import { useCreateChat } from "@/query/useChat";
import { useRouter } from "next/router";

interface TemplateViewProps {
  templateId?: string;
}

export default function TemplateView(props: TemplateViewProps) {
  const router = useRouter();

  const chat = useCreateChat((instance) =>
    router.push(`/instance/${instance.id}`)
  );

  const handleMessage = React.useCallback(
    (message: string) => {
      chat.send(message);
    },
    [chat]
  );

  return (
    <>
      <AppHeader />
      <Layout>
        <ConnectedSidebar />
        <Content>
          <Instance messages={chat.messages} onMessage={handleMessage} />
        </Content>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const templateId = context.query?.template as string;

  return {
    props: {
      templateId: templateId || null,
    },
  };
}
