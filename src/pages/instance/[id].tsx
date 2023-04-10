import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import ConnectedSidebar from "@/components/connected/ConnectedSidebar";
import { TemplateResponse } from "@/types/api";
import { GetServerSidePropsContext } from "next";
import { Instance } from "@/components/layout/Instance";
import { useChat } from "@/query/useChat";
import React from "react";
import { SquashModal } from "@/components/modals/SquashModal";
import { INode } from "@/types/chat";
import { MergeModal } from "@/components/modals/MergeModal";

export default function InstanceView(props: { id: TemplateResponse["id"] }) {
  const chat = useChat(props.id);

  const [squash, setSquash] = React.useState(false);
  const [merging, setMerging] = React.useState(false);

  const handleMessage = React.useCallback(
    (message: string) => {
      chat.send(message);
    },
    [chat]
  );

  const handleSquashCancel = React.useCallback(() => {
    setSquash(false);
  }, []);

  const handleSquashStart = React.useMemo(() => {
    if (chat.instance && chat.instance.nodes.length > 2)
      return () => setSquash(true);
    return undefined;
  }, [chat.instance]);

  const handleSquashSubmit = React.useCallback(
    (nodes: INode[]) => {
      setSquash(false);
      chat.replaceNodes(nodes);
    },
    [chat]
  );

  const handleMergeCancel = React.useCallback(() => {
    setMerging(false);
  }, []);

  const handleMergeStart = React.useCallback(() => {
    setMerging(true);
  }, []);

  const handleMerge = React.useCallback(
    (targetPointer: string) => {
      if (chat.pointer) {
        chat.merge(chat.pointer.id, targetPointer);
        setMerging(false);
      }
    },
    [chat]
  );

  const handleRegenerate = React.useCallback(() => {
    chat.regenerateLastNode();
  }, [chat]);

  const handleBranch = React.useCallback(
    (node: INode) => {
      chat.checkoutNode(node);
    },
    [chat]
  );

  return (
    <>
      <AppHeader />
      <Layout>
        <ConnectedSidebar />
        <Content>
          {chat && chat.instance ? (
            <>
              <Instance
                key={chat.instance.id}
                title={chat.instance.title}
                nodes={chat.instance.nodes}
                pointer={chat.pointer}
                tree={chat.tree}
                references={chat.instance.references}
                onMessage={handleMessage}
                onNodeChange={(node) => {
                  if (node.type === "message")
                    chat.modifyUserNode(node.id, node.content.content);
                }}
                onSquash={handleSquashStart}
                onMerge={handleMergeStart}
                onRegenerate={handleRegenerate}
                onBranch={handleBranch}
              />
              {squash && (
                <SquashModal
                  instance={chat.instance}
                  onSave={handleSquashSubmit}
                  onCancel={handleSquashCancel}
                />
              )}
              {merging && (
                <MergeModal
                  instance={chat.instance}
                  tree={chat.tree}
                  onSave={handleMerge}
                  onCancel={handleMergeCancel}
                />
              )}
            </>
          ) : null}
        </Content>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  return {
    props: {
      id,
    },
  };
}
