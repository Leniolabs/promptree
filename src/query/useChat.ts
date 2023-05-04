import { getResponse } from "@/ai/openai";
import { IInstance, IInstanceConfig } from "@/types/api";
import { ICheckoutOptions, IMergeOptions, IMessage } from "@/types/chat";
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
  useCreateInstance,
  useInstance,
} from "./useInstances";
import { useQueryClient } from "react-query";
import { useAPIKey } from "@/store";

export function useCreateChat(onCreate?: (instance: IInstance) => void) {
  const apikey = useAPIKey();
  const { createAsync } = useCreateInstance();
  const [messages, setMessages] = React.useState<IInstance["messages"]>([]);

  const send = React.useCallback(
    (content: string) => {
      const userMessage = createMessage("user", content);
      const assistantMessage = createMessage("assistant", "");

      setMessages([userMessage, assistantMessage]);

      const currentMessageList = [
        {
          role: userMessage.author,
          content: userMessage.content,
        },
      ] as ChatCompletionRequestMessage[];

      const handleChunk = (chunk: string) => {
        assistantMessage.content += chunk;

        setMessages([userMessage, assistantMessage]);
      };

      getResponse(apikey, currentMessageList, handleChunk).then(
        async (response) => {
          if (response) {
            assistantMessage.content = response.content;

            const title = await createInstanceTitle(apikey, [
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
        }
      );
    },
    [apikey, onCreate]
  );

  return {
    messages,
    send,
  };
}

export function useChat(id: Instance["id"]) {
  const apikey = useAPIKey();
  const {
    data: instance,
    updateLocal,
    addMessagesAsync,
    checkoutAsync,
    mergeAsync,
    refresh,
    updateAsync,
    forkAsync,
  } = useInstance(id);

  const send = React.useCallback(
    (content: string) => {
      if (instance) {
        const userMessage = createMessage("user", content);
        const assistantMessage = createMessage("assistant", "");

        const currentMessagesList = [
          ...instance.messages,
          userMessage,
        ] as IMessage[];

        updateLocal({
          messages: [...currentMessagesList, assistantMessage],
        });

        const currentMessageList = currentMessagesList.map((message) => {
          return {
            role: message.author,
            content: message.content,
          };
        }) as ChatCompletionRequestMessage[];

        const handleChunk = (chunk: string) => {
          assistantMessage.content += chunk;

          updateLocal({
            messages: [...currentMessagesList, assistantMessage],
          });
        };

        getResponse(apikey, currentMessageList, handleChunk).then(
          (response) => {
            if (response) {
              assistantMessage.content = response.content;

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
          }
        );
      }
    },
    [apikey, instance]
  );

  const editMessage = React.useCallback(
    (messageId: string, content: string) => {
      if (instance) {
        const messageIndex = instance.messages.findIndex(
          (x) => x.id === messageId
        );
        const userMessage = instance.messages[messageIndex];
        userMessage.content = content;

        const assistantMessage = createMessage("assistant", "");

        const currentMessagesList = [
          ...instance.messages.slice(0, messageIndex),
          userMessage,
        ] as IMessage[];

        updateLocal({
          messages: [...currentMessagesList, assistantMessage],
        });

        const currentMessageList = currentMessagesList.map((message) => {
          return {
            role: message.author,
            content: message.content,
          };
        }) as ChatCompletionRequestMessage[];

        const handleChunk = (chunk: string) => {
          assistantMessage.content += chunk;

          updateLocal({
            messages: [...currentMessagesList, assistantMessage],
          });
        };

        getResponse(apikey, currentMessageList, handleChunk).then(
          (response) => {
            if (response) {
              assistantMessage.content = response.content;

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
          }
        );
      }
    },
    [apikey, instance]
  );

  const regenerateLastNode = React.useCallback(() => {
    if (instance) {
      const userMessages = instance.messages.filter((x) => x.author === "user");
      const userMessage = userMessages[userMessages.length - 1];

      const assistantMessage = createMessage("assistant", "");

      const currentMessagesList = [
        ...instance.messages.slice(0, -2),
        userMessage,
      ] as IMessage[];

      updateLocal({
        messages: [...currentMessagesList, assistantMessage],
      });

      const currentMessageList = currentMessagesList.map((message) => {
        return {
          role: message.author,
          content: message.content,
        };
      }) as ChatCompletionRequestMessage[];

      const handleChunk = (chunk: string) => {
        assistantMessage.content += chunk;

        updateLocal({
          messages: [...currentMessagesList, assistantMessage],
        });
      };

      getResponse(apikey, currentMessageList, handleChunk).then((response) => {
        if (response) {
          assistantMessage.content = response.content;

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
  }, [apikey, instance]);

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

  const changeConfig = React.useCallback(
    (config: IInstanceConfig) => {
      if (instance) {
        updateLocal({
          ...config,
        });

        updateAsync(instance.id, {
          ...config,
        });
      }
    },
    [instance]
  );

  const fork = React.useCallback(
    (onFork?: (id: string) => void) => {
      if (instance) {
        forkAsync(instance.id).then((forked) => onFork?.(forked.id));
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
    changeConfig,
    fork,
  };
}

export function useSquashChat(id: Instance["id"], ref: IInstance["refHash"]) {
  const queryClient = useQueryClient();
  const apikey = useAPIKey();

  const [loadingDifference, setLoadingDifference] =
    React.useState<boolean>(true);
  const [difference, setDifference] = React.useState<IMessage[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<string>();

  const [loadingSquash, setLoadingSquash] = React.useState<boolean>(true);
  const [squashMessages, setSquashMessages] = React.useState<IMessage[]>([]);

  const retry = React.useCallback(
    (messages?: IMessage[]) => {
      setLoadingSquash(true);
      squashNodes(apikey, messages || difference).then((squash) => {
        setSquashMessages(squash);
        setLoadingSquash(false);
      });
    },
    [apikey, difference]
  );

  React.useEffect(() => {
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
