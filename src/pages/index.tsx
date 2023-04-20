import React from "react";
import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import { ConnectedSidebar } from "@/components/connected";
import { Instance } from "@/components/layout/Instance";
import { useCreateChat } from "@/query/useChat";
import { useRouter } from "next/router";

export default function InstanceView() {
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
