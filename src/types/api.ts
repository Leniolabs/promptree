import { Instance } from "@prisma/client";
import { IBranch, ICommit, IMessage } from "./chat";

export type IInstance = Omit<Instance, "content"> & {
  messages: IMessage[];
  commits: ICommit[];
  branches: IBranch[];
  refHash: string;
  refBranch: string;
};

export type IInstanceConfig = Pick<IInstance, "public">;

export type InstanceResponse = IInstance;
export type InstanceListResponse = Pick<Instance, "id" | "title">[];

export type EmptyErrorResponse = {};
