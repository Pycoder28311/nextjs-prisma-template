export const DEFAULT_IGNORED_FIELDS = ["id", "position", "createdAt", "updatedAt"];

const fieldConfig: Record<string, Record<string, Record<string, any>>> = {
  product: {
    name: {
      label: "Product Name",
      options: ["Widget", "Gadget", "Doohickey", "Thingamajig"],
    },
    price: {
      label: "Price (€)",
      min: 0,
    },
  },
  user: {
    accounts: {
      relationType: "child",
    },
    sessions: {
      relationType: "child",
    },
    passwordResets: {
      relationType: "child",
    },
  },
};

export const tableConfig: Record<string, { ignoredFields?: string[] }> = {
  product: {},
};

export default fieldConfig;
