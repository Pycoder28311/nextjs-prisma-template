"use client";

import type { Product, ProductChild, TestTable } from "@/config/types";
import { useTable } from "@/utils/useTable";
import { useAbsoluteModal } from "@/context/AppContext";
import DataForm from "@/components/DataForm";
import GridLayout from "@/components/GridLayout";
import ProductCard from "@/components/ProductCard";
import CrudButton from "@/components/CrudButton";
import EditInput from "@/components/EditInput";
import ShaderBackground from "@/components/ui/shader-background";

function AbsoluteModalExamples() {
  const belowModal = useAbsoluteModal();
  const aboveModal = useAbsoluteModal();
  const rightModal = useAbsoluteModal();
  const hoverModal = useAbsoluteModal();

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-700">Absolute modal examples</h2>
      <div className="flex flex-wrap gap-2">
        <button
          {...belowModal.triggerProps}
          type="button"
          onClick={() =>
            belowModal.toggle({
              side: "top",
              align: "end",
              component: (
                <div className="p-3 text-sm text-gray-700 bg-white rounded shadow-md">
                  <p className="font-medium mb-1">Below the button</p>
                  <p className="text-gray-500">side: "bottom" (default), align: "end".</p>
                  <button
                    type="button"
                    onClick={() => belowModal.close()}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Close this one
                  </button>
                </div>
              ),
            })
          }
          className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Open below
        </button>
        <button
          {...aboveModal.triggerProps}
          type="button"
          onClick={() =>
            aboveModal.toggle({
              side: "top",
              matchAnchorWidth: false,
              component: (
                <ul className="py-1 text-sm text-gray-700 bg-white rounded shadow-md">
                  {["Edit", "Duplicate", "Archive", "Delete"].map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => aboveModal.close()}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ),
            })
          }
          className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-900"
        >
          Open dropdown menu
        </button>
        <button
          {...rightModal.triggerProps}
          type="button"
          onClick={() =>
            rightModal.toggle({
              side: "bottom",
              align: "start",
              component: (
                <div className="p-3 text-sm text-gray-700 bg-white rounded shadow-md">
                  <p className="font-medium mb-1">side: "bottom", align: "end"</p>
                  <p className="text-gray-500">
                    Modal's right edge aligns with the button's right edge.
                  </p>
                </div>
              ),
            })
          }
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Open right-aligned
        </button>
        <button
          {...hoverModal.triggerProps}
          type="button"
          onMouseEnter={() =>
            hoverModal.open({
              side: "right",
              align: "center",
              closeOnLeave: true,
              component: (
                <div className="p-3 text-sm text-gray-700 w-full">
                  <p className="font-medium mb-1">Hover-triggered (side: "right")</p>
                  <p className="text-gray-500 mb-2">
                    Stays open while your cursor is on this modal. Move the mouse away to close.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert("clicked an item inside the hover modal")}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Click an item
                  </button>
                </div>
              ),
            })
          }
          onMouseLeave={() => hoverModal.closeSoon()}
          className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Hover me
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Click multiple buttons to stack modals — they don't close each other. Click anywhere outside
        the triggers and modals to close them all. The green button uses hover.
      </p>
    </div>
  );
}

export default function HomePage() {
  const productData = useTable<Product>("product");
  const productChildData = useTable<ProductChild>("productChild");

  return (
    <div className="min-h-screen p-8">
      {/*<ShaderBackground />*/}
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <AbsoluteModalExamples />

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product</h2>
          <DataForm table="product" onSuccess={productData.append} />
        </div>

        <GridLayout title="Products" layout="one-column" table="product" onReorder={productData.reorder}>
          {productData.records.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </GridLayout>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">New Product Child</h2>
          <DataForm table="productChild" onSuccess={productChildData.append} />
        </div>

        <GridLayout title="Product Children" layout="one-column" table="productChild" onReorder={productChildData.reorder}>
          {productChildData.records.map((productChild) => (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-3 flex items-center gap-6">
              <EditInput value={productChild.name ?? ""} table="productChild" field="name" id={productChild.id} />
              <CrudButton
                type="delete"
                table="productChild"
                loading={productChildData.isDeletingId(productChild.id)}
                onClick={() => productChildData.remove(productChild.id)}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
