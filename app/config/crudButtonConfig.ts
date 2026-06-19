import type { ButtonVariant } from "./buttonConfig";

export type CrudButtonType = "create" | "edit" | "save" | "delete";

/** Maps each CRUD action to a reusable Button variant. */
export const crudButtonVariant: Record<CrudButtonType, ButtonVariant> = {
  create: "secondary",
  save: "secondary",
  edit: "tertiary",
  delete: "delete",
};

export type RelationLinkerButtonType = "link" | "unlink";

/** RelationLinker's Link/Unlink button mapped to reusable Button variants. */
export const relationLinkerVariant: Record<RelationLinkerButtonType, ButtonVariant> = {
  link: "tertiary",
  unlink: "delete",
};

export type CustomSelectButtonType = "select" | "option";

/** CustomSelect's trigger box and option rows mapped to reusable Button variants. */
export const customSelectVariant: Record<CustomSelectButtonType, ButtonVariant> = {
  select: "tertiary-bordered",
  option: "nav",
};
