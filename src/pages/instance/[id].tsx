import React from "react";
import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import {
  ConnectedSidebar,
  SquashModal,
  MergeModal,
  NewBranchModal,
} from "@/components/connected";
import { TemplateResponse } from "@/types/api";
import { GetServerSidePropsContext } from "next";
import { Instance } from "@/components/layout/Instance";
import { useChat } from "@/query/useChat";

export default function InstanceView(props: { id: TemplateResponse["id"] }) {
  const chat = useChat(props.id);

  const [mode, setMode] = React.useState<
    "CREATE_BRANCH" | "MERGE" | "SQUASH_MERGE" | undefined
  >();
  const [modeOptions, setModeOptions] = React.useState<any>({});

  const handleMessage = React.useCallback(
    (message: string) => {
      chat.send(message);
    },
    [chat]
  );

  const handleRegenerate = React.useCallback(() => {
    chat.regenerateLastNode();
  }, [chat]);

  const handleModeCancel = React.useCallback(() => {
    setMode(undefined);
    setModeOptions({});
  }, []);

  const handleBranchStart = React.useCallback((hash: string) => {
    setMode("CREATE_BRANCH");
    setModeOptions({ startPoint: hash });
  }, []);

  const handleCreateBranch = React.useCallback(
    (branchName: string) => {
      chat.checkout({ branchName, create: true, ...(modeOptions || {}) });
      setMode(undefined);
      setModeOptions({});
    },
    [chat]
  );

  const handleMerge = React.useCallback(
    (targetBranch: string) => {
      if (chat.instance) {
        chat.merge({
          fromBranch: targetBranch,
          toBranch: chat.instance.ref,
        });
        setMode(undefined);
        setModeOptions({});
      }
    },
    [chat]
  );

  const handleSquashStart = React.useMemo(() => {
    if (chat.instance && chat.instance.branches.length > 1)
      return () => {
        setMode("SQUASH_MERGE");
        setModeOptions({});
      };
    return undefined;
  }, [chat.instance]);

  const handleSquash = React.useCallback(() => {
    setMode(undefined);
    setModeOptions({});
    // chat.refresh();
  }, [chat.refresh]);

  const handleMergeStart = React.useMemo(() => {
    if (chat.instance && chat.instance.branches.length > 1)
      return () => {
        setMode("MERGE");
        setModeOptions({});
      };
    return undefined;
  }, [chat.instance]);

  const handleTrack = React.useCallback(
    (ref: string) => {
      if (chat.instance?.branches.find((branch) => branch.branch === ref))
        chat.checkout({ branchName: ref });
      else return handleBranchStart(ref);
    },
    [chat, handleBranchStart]
  );

  const currentBranch = React.useMemo(() => {
    if (!chat.instance) return null;
    return chat.instance.branches.find(
      (branch) => branch.hash === chat.instance?.ref
    );
  }, [chat]);

  return (
    <>
      <Layout>
        <ConnectedSidebar />
        <Content>
          {chat && chat.instance ? (
            <>
              <Instance
                key={chat.instance.id}
                title={chat.instance.title}
                messages={chat.instance.messages}
                commits={chat.instance.commits}
                branches={chat.instance.branches}
                pointer={chat.instance.ref}
                onMessage={handleMessage}
                onMessageChange={(message) => {
                  chat.editMessage(message.id, message.content);
                }}
                onRegenerate={handleRegenerate}
                onBranchCreate={handleBranchStart}
                onTrack={handleTrack}
                onMerge={handleMergeStart}
                onSquash={handleSquashStart}
              />
            </>
          ) : null}
          {mode === "CREATE_BRANCH" && (
            <NewBranchModal
              hash={modeOptions?.startPoint}
              onSave={handleCreateBranch}
              onCancel={handleModeCancel}
            />
          )}
          {mode === "MERGE" && currentBranch && (
            <MergeModal
              currentBranch={currentBranch}
              branches={chat.instance?.branches || []}
              onSave={handleMerge}
              onCancel={handleModeCancel}
            />
          )}
          {mode === "SQUASH_MERGE" && chat.instance && currentBranch && (
            <SquashModal
              id={props.id}
              currentBranch={currentBranch}
              targetName={currentBranch.branch}
              branches={chat.instance?.branches || []}
              onSave={handleSquash}
              onCancel={handleModeCancel}
            />
          )}
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
