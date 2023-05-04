export type IMergeOptions = {
  fromBranch: string;
  toBranch: string;
  squashMessages?: IMessage[];
};

export type ICheckoutOptions =
  | {
      branchName: string;
      noUpdateHead?: boolean;
    }
  | {
      create: true;
      branchName: string;
      startPoint?: string;
      noUpdateHead?: boolean;
    };

export type IBranch = {
  hash: string;
  branch: string;
};

export type IMessage = {
  id: string;
  author: "system" | "user" | "assistant";
  content: string;
  avatar?: string;
};

export type ICommit = {
  hash: string;
  tree: string;
  timestamp: number;
  message: string;
  parents: string[];
};

export type ISquashResponse = {
  user: string;
  assistant: string;
};
