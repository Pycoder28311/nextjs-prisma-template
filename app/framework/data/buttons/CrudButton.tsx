"use client";

import Button from "@/framework/ui/buttons/Button";
import { crudButtonVariant, type CrudButtonType } from "@/config/crudButtonConfig";

export type { CrudButtonType };

type Props = {
  type: CrudButtonType;
  table: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const labels: Record<CrudButtonType, string> = {
  create: "Create",
  edit:   "Edit",
  save:   "Save",
  delete: "Delete",
};

const loadingLabels: Record<CrudButtonType, string> = {
  create: "Creating...",
  edit:   "Edit",
  save:   "Saving...",
  delete: "Deleting...",
};

export default function CrudButton({ type, onClick, disabled, loading }: Props) {
  return (
    <Button
      styleType={crudButtonVariant[type]}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? loadingLabels[type] : labels[type]}
    </Button>
  );
}
