export type IMessage = {
  author: "system" | "user" | "assistant";
  content: string;
};

export type IReference = {
  nodeId: string;
  name: string;
};

export type INode = {
  id: string;
  date: Date;
  type: "message" | "merge" | "merge-squash";
  parents: string[];
} & (
  | {
      type: "message";
      content: IMessage;
    }
  | {
      type: "merge";
      merged: string[]; //ids of nodes merged
    }
);

export type ISquashResponse = {
  user: string;
  assistant: string;
};
