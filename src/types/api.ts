import { Instance, Template } from "@prisma/client";
import { INode, IReference } from "./chat";

export type IInstance = Pick<Instance, "mode" | "title"> & {
  nodes: INode[];
  references: IReference[];
} & Partial<Omit<Instance, "content" | "refs">>;

export type ITemplate = Pick<Template, "title" | "content" | "type"> &
  Partial<Template>;

export type InstanceResponse = IInstance;
export type InstanceListResponse = Pick<
  Instance,
  "id" | "title" | "model" | "mode"
>[];

export type TemplateResponse = ITemplate & Pick<Template, "id">;
export type TemplateListResponse = Pick<Template, "id" | "title" | "type">[];

export type EmptyErrorResponse = {};
