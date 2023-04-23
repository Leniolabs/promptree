import React from "react";
import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import {
  ConnectedSidebar,
  SquashModal,
  MergeModal,
  NewBranchModal,
} from "@/components/connected";
import { GetServerSidePropsContext } from "next";
import { Instance } from "@/components/layout/Instance";
import { useChat } from "@/query/useChat";
import { InstanceResponse } from "@/types/api";
import { useAPIKey } from "@/store";
import { getSession } from "next-auth/react";
import { getInstanceById, getUserByEmail } from "@/utils/queries";

export default function InstanceView(props: { id: InstanceResponse["id"] }) {
  const chat = useChat(props.id);

  const apikey = useAPIKey();

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

  const handleNewBranchStart = React.useCallback((hash: string) => {
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
          toBranch: chat.instance.refHash,
        });
        setMode(undefined);
        setModeOptions({});
      }
    },
    [chat]
  );

  const handleMergeSquashStart = React.useMemo(() => {
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
      else return handleNewBranchStart(ref);
    },
    [chat, handleNewBranchStart]
  );

  const currentBranch = React.useMemo(() => {
    if (!chat.instance) return null;
    return chat.instance.branches.find(
      (branch) => branch.hash === chat.instance?.refHash
    );
  }, [chat]);

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
                messages={chat.instance.messages}
                commits={chat.instance.commits}
                branches={chat.instance.branches}
                refHash={chat.instance.refHash}
                refBranch={chat.instance.refBranch}
                onMessage={apikey ? handleMessage : undefined}
                onMessageChange={(message) => {
                  chat.editMessage(message.id, message.content);
                }}
                onRegenerate={handleRegenerate}
                onNewBranch={handleNewBranchStart}
                onTrack={handleTrack}
                onMerge={handleMergeStart}
                onMergeSquash={handleMergeSquashStart}
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

  const session = await getSession(context);
  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  const instance = await getInstanceById(id);

  if (!instance || (!instance.public && instance.userId !== user?.id))
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };

  return {
    props: {
      id,
    },
  };
}
