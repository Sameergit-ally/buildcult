// src/components/ui/sponsor-grid.tsx
"use client";

import * as React from "react";

/**
 * SponsorGrid – renders every image found in the project's `sponsor/` directory.
 * It uses Vite's import.meta.glob to import the images at build time, so no
 * runtime file‑system access is required.
 *
 * Tailwind classes give a responsive grid that matches the visual language of
 * the rest of the site.
 */
export const SponsorGrid = () => {
  // Load all image files (png, jpg, jpeg, gif, svg) from the sibling `sponsor` folder.
  // The `as: "url"` option makes Vite return the resolved URL for each import.
  const modules = import.meta.glob("../sponsor/*.{png,jpg,jpeg,gif,svg}", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const images = React.useMemo(() => {
    return Object.entries(modules)
      .map(([path, url]) => ({
        // Strip the directory and extension for a simple alt text.
        name: path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "sponsor",
        url,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [modules]);

  if (images.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No sponsor images found.
      </p>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Our Sponsors</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map(({ name, url }) => (
          <div
            key={url}
            className="flex items-center justify-center overflow-hidden rounded-lg bg-muted/30 p-2 transition-transform hover:scale-105"
          >
            <img src={url} alt={name} className="max-h-16 max-w-full object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
};

