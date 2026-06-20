"use client";

import { useState } from "react";
import Button from "@/framework/ui/buttons/Button";
import SearchInput from "@/framework/ui/searchInput/SearchInput";
import Input from "@/framework/ui/input/Input";
import Text from "@/framework/ui/text/Text";
import { BUTTON_VARIANTS } from "@/config/buttonConfig";
import { INPUT_STYLE_TYPES } from "@/config/inputConfig";

export default function AboutPage() {
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="mt-2 text-gray-600">
          Examples of the reusable <code>Button</code> component.
        </p>
      </header>

      {/* All variants */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">All types</h2>
        <div className="flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Button
              key={variant}
              styleType={variant}
              onClick={() => alert(`Clicked ${variant}`)}
            >
              {variant}
            </Button>
          ))}
        </div>
      </section>

      {/* Disabled variants */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Disabled</h2>
        <div className="flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} styleType={variant} disabled>
              {variant}
            </Button>
          ))}
        </div>
      </section>

      {/* Combinations */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Combinations</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button styleType="primary" onClick={() => alert("Saved!")}>
            Save
          </Button>
          <Button styleType="secondary" onClick={() => alert("Cancelled")}>
            Cancel
          </Button>
          <Button styleType="tertiary" onClick={() => alert("Learn more")}>
            Learn more →
          </Button>
          <Button styleType="primary" disabled>
            Saving…
          </Button>
          <Button styleType="primary" className="w-full">
            Full width primary
          </Button>
        </div>
      </section>

      {/* SearchInput combinations */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">SearchInput</h2>
        <div className="space-y-4">
          {/* simple, default icon */}
          <SearchInput
            styleType="simple"
            placeholder="Simple search…"
            onClick={() => alert("Input clicked")}
            onType={(v) => console.log("typing:", v)}
          />

          {/* BigSearch, controlled value */}
          <SearchInput
            styleType="BigSearch"
            placeholder="Big search…"
            value={query}
            onType={setQuery}
          />
          <p className="text-sm text-gray-500">Controlled value: “{query}”</p>

          {/* simple, no search icon */}
          <SearchInput styleType="simple" placeholder="No icon" searchIcon={false} />

          {/* BigSearch, with a left button */}
          <SearchInput
            styleType="BigSearch"
            placeholder="With left button…"
            leftButton={
              <Button styleType="tertiary" onClick={() => alert("Filter")}>
                Filter
              </Button>
            }
          />

          {/* simple, onHover */}
          <SearchInput
            styleType="simple"
            placeholder="Hover me"
            onHover={() => console.log("hovered search")}
          />
        </div>
      </section>

      {/* Input combinations */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Input</h2>
        <div className="space-y-4">
          {/* every style type */}
          {INPUT_STYLE_TYPES.map((styleType) => (
            <Input
              key={styleType}
              styleType={styleType}
              placeholder={`${styleType} input…`}
            />
          ))}

          {/* controlled value */}
          <Input
            styleType="outlined"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-gray-500">Controlled value: “{name}”</p>

          {/* native props pass through: type + disabled */}
          <Input styleType="filled" type="email" placeholder="email@site.com" />
          <Input styleType="outlined" placeholder="Disabled" disabled />
        </div>
      </section>

      {/* Input types (native) */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Input types</h2>
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Text</span>
            <Input type="text" placeholder="text" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Number</span>
            <Input type="number" placeholder="0" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Date</span>
            <Input type="date" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Time</span>
            <Input type="time" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Password</span>
            <Input type="password" placeholder="••••••" />
          </label>

          <label className="flex items-center gap-2">
            <Input type="checkbox" />
            <span className="text-sm text-gray-600">Checkbox</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <Input type="radio" name="demo" />
              <span className="text-sm text-gray-600">Option A</span>
            </label>
            <label className="flex items-center gap-2">
              <Input type="radio" name="demo" />
              <span className="text-sm text-gray-600">Option B</span>
            </label>
          </div>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Color</span>
            <Input type="color" defaultValue="#3b82f6" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">Range</span>
            <Input type="range" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-gray-600">File</span>
            <Input type="file" />
          </label>
        </div>
      </section>

      {/* Text component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Text</h2>

        {/* Standalone (not inside buttons) */}
        <div className="flex flex-col items-start gap-2">
          <Text value="Very small with info" size="very small" icon="info" />
          <Text value="Small with star" size="small" icon="star" />
          <Text value="Medium, icon on right" size="medium" icon="arrow-right" iconPosition="right" />
          <Text value="Big home heading" size="big" icon="home" />
          <Text icon="search" size="large" /> {/* icon only, centered */}
        </div>

        {/* Inside buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button styleType="primary">
            <Text value="Save" icon="check" />
          </Button>
          <Button styleType="secondary">
            <Text value="Settings" icon="settings" />
          </Button>
          <Button styleType="delete">
            <Text value="Delete" icon="trash" />
          </Button>
          <Button styleType="tertiary">
            <Text value="Next" icon="arrow-right" iconPosition="right" />
          </Button>
          <Button styleType="primary" className="w-10 h-10 p-0!">
            <Text icon="heart" /> {/* icon-only button */}
          </Button>
        </div>
      </section>
    </main>
  );
}
