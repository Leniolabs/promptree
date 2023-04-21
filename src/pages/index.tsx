import React from "react";
import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import { ConnectedSidebar } from "@/components/connected";
import { Instance } from "@/components/layout/Instance";
import { useCreateChat } from "@/query/useChat";
import { useRouter } from "next/router";
import { useAPIKey } from "@/store";
import { MissingAPIKeyMsg } from "@/components/misc/MissingAPIKeyMsg";
import axios from "axios";
import { getCsrfToken, getSession, useSession } from "next-auth/react";

export default function InstanceView() {
  const apikey = useAPIKey();
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
          {!apikey && <MissingAPIKeyMsg />}
          {apikey && (
            <Instance messages={chat.messages} onMessage={handleMessage} />
          )}
        </Content>
      </Layout>
    </>
  );
}
