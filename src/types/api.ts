import { Instance, Template } from "@prisma/client";
import { IBranch, ICommit, IMessage } from "./chat";

export type IInstance = Omit<Instance, "content"> & {
  messages: IMessage[];
  commits: ICommit[];
  branches: IBranch[];
  ref: string;
};

export type ITemplate = Pick<Template, "title" | "content" | "type"> &
  Partial<Template>;

export type InstanceResponse = IInstance;
export type InstanceListResponse = Pick<Instance, "id" | "title">[];

export type TemplateResponse = ITemplate & Pick<Template, "id">;
export type TemplateListResponse = Pick<Template, "id" | "title" | "type">[];

export type EmptyErrorResponse = {};
