import { getResponse } from "@/ai/openai";
import { IInstance } from "@/types/api";
import {
  ICheckoutOptions,
  ICommit,
  IMergeOptions,
  IMessage,
} from "@/types/chat";
import {
  createInstanceTitle,
  createMessage,
  squashNodes,
} from "@/utils/instance";
import { Instance } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import React from "react";
import {
  initSquashInstance,
  mergeSquashInstance,
  useInstance,
  useInstances,
} from "./useInstances";
import { useQueryClient } from "react-query";

export function useCreateChat(onCreate?: (instance: IInstance) => void) {
  const { createAsync } = useInstances();
  const [messages, setMessages] = React.useState<IInstance["messages"]>([]);

  const send = React.useCallback(
    (content: string) => {
      const userMessage = createMessage("user", content);

      setMessages([userMessage]);

      const currentMessageList = [
        {
          role: userMessage.author,
          content: userMessage.content,
        },
      ] as ChatCompletionRequestMessage[];

      getResponse(currentMessageList).then(async (response) => {
        if (response) {
          const assistantMessage = createMessage("assistant", response.content);

          const title = await createInstanceTitle([
            userMessage,
            assistantMessage,
          ]);

          createAsync({
            messages: [userMessage, assistantMessage],
            title,
          }).then((created) => {
            onCreate?.(created);
            setMessages([userMessage, assistantMessage]);
          });
        }
      });
    },
    [onCreate]
  );

  return {
    messages,
    send,
  };
}

export function useChat(id: Instance["id"]) {
  const {
    data: instance,
    updateLocal,
    addMessagesAsync,
    checkoutAsync,
    mergeAsync,
    refresh,
  } = useInstance(id);

  const send = React.useCallback(
    (content: string) => {
      if (instance) {
        const userMessage = createMessage("user", content);

        const currentMessagesList = [
          ...instance.messages,
          userMessage,
        ] as IMessage[];

        updateLocal({
          messages: currentMessagesList,
        });

        const currentMessageList = currentMessagesList.map((message) => {
          return {
            role: message.author,
            content: message.content,
          };
        }) as ChatCompletionRequestMessage[];

        getResponse(currentMessageList).then((response) => {
          if (response) {
            const assistantMessage = createMessage(
              "assistant",
              response.content
            );

            addMessagesAsync(id, {
              messages: [userMessage, assistantMessage] as IMessage[],
            });

            updateLocal({
              messages: [
                ...instance.messages,
                userMessage,
                assistantMessage,
              ] as IMessage[],
            });
          }
        });
      }
    },
    [instance]
  );

  const editMessage = React.useCallback(
    (messageId: string, content: string) => {
      if (instance) {
        const messageIndex = instance.messages.findIndex(
          (x) => x.id === messageId
        );
        const userMessage = instance.messages[messageIndex];
        userMessage.content = content;

        const currentMessagesList = [
          ...instance.messages.slice(0, messageIndex),
          userMessage,
        ] as IMessage[];

        updateLocal({
          messages: currentMessagesList,
        });

        const currentMessageList = currentMessagesList.map((message) => {
          return {
            role: message.author,
            content: message.content,
          };
        }) as ChatCompletionRequestMessage[];

        getResponse(currentMessageList).then((response) => {
          if (response) {
            const assistantMessage = createMessage(
              "assistant",
              response.content
            );

            addMessagesAsync(id, {
              messages: [userMessage, assistantMessage] as IMessage[],
              edit: true,
            });

            updateLocal({
              messages: [
                ...instance.messages,
                userMessage,
                assistantMessage,
              ] as IMessage[],
            });
          }
        });
      }
    },
    [instance]
  );

  const regenerateLastNode = React.useCallback(() => {
    if (instance) {
      const userMessages = instance.messages.filter((x) => x.author === "user");
      const userMessage = userMessages[userMessages.length - 1];

      const currentMessagesList = [
        ...instance.messages.slice(0, -2),
        userMessage,
      ] as IMessage[];

      updateLocal({
        messages: currentMessagesList,
      });

      const currentMessageList = currentMessagesList.map((message) => {
        return {
          role: message.author,
          content: message.content,
        };
      }) as ChatCompletionRequestMessage[];

      getResponse(currentMessageList).then((response) => {
        if (response) {
          const assistantMessage = createMessage("assistant", response.content);

          addMessagesAsync(id, {
            messages: [userMessage, assistantMessage] as IMessage[],
            regenerate: true,
          });

          updateLocal({
            messages: [
              ...instance.messages,
              userMessage,
              assistantMessage,
            ] as IMessage[],
          });
        }
      });
    }
  }, [instance]);

  const checkout = React.useCallback(
    (options: ICheckoutOptions) => {
      if (instance) {
        checkoutAsync(instance.id, {
          ...options,
        });
      }
    },
    [instance]
  );

  const merge = React.useCallback(
    (options: IMergeOptions) => {
      if (instance) {
        mergeAsync(instance.id, {
          ...options,
        });
      }
    },
    [instance]
  );

  return {
    instance,
    send,
    merge,
    editMessage,
    regenerateLastNode,
    checkout,
    refresh,
  };
}

export function useSquashChat(id: Instance["id"], ref: IInstance["ref"]) {
  const queryClient = useQueryClient();

  const [loadingDifference, setLoadingDifference] =
    React.useState<boolean>(true);
  const [difference, setDifference] = React.useState<IMessage[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<string>();

  const [loadingSquash, setLoadingSquash] = React.useState<boolean>(true);
  const [squashMessages, setSquashMessages] = React.useState<IMessage[]>([]);

  const retry = React.useCallback(
    (messages?: IMessage[]) => {
      setLoadingSquash(true);
      squashNodes(messages || difference).then((squash) => {
        setSquashMessages(squash);
        setLoadingSquash(false);
      });
    },
    [difference]
  );

  React.useEffect(() => {
    console.log(id, ref, targetBranch);
    if (ref && targetBranch) {
      setLoadingDifference(true);
      initSquashInstance(id, {
        fromBranch: targetBranch,
        toBranch: ref,
      }).then((resp) => {
        setLoadingDifference(false);
        setDifference(resp.difference);
        retry(resp.difference);
      });
    }
  }, [id, ref, targetBranch]);

  const loading = React.useMemo(() => {
    return loadingDifference || loadingSquash;
  }, [loadingDifference, loadingSquash]);

  const merge = React.useCallback(() => {
    if (!loading && targetBranch && squashMessages) {
      mergeSquashInstance(id, {
        fromBranch: targetBranch,
        toBranch: ref,
        squashMessages,
      }).then(() => {
        queryClient.invalidateQueries(`fetch-instance-${id}`);
      });
    }
  }, [loading, id, ref, targetBranch, squashMessages]);

  return {
    loading,
    squashMessages,
    targetBranch,
    changeTargetBranch: setTargetBranch,
    merge,
    retry,
  };
}
