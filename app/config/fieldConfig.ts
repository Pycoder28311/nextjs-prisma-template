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
};

export default fieldConfig;
