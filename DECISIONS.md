 Kipepeo Market — Decisions Log
Chapter 4 — Site Shell: About, Contact & 404

 Decision: All visual assets will be stored locally in the project.
Reason: Avoid broken external image URLs and make the project more reliable.

 Decision: Unsplash is the primary photography source.
Reason: High-quality, free stock photos with a consistent aesthetic.

 Decision: All assets must be recorded in ASSET-REGISTER.md.
Reason: Create a single source of truth for all project assets.

 Decision: Asset filenames will describe their purpose.
Reason: Prevent ambiguous filenames like `IMG_1234.jpg` and make the project more maintainable.

 Decision: Only navigation links for pages that actually exist will be displayed.
Reason: The project should never contain fake/dead navigation.

 Decision: The header and footer are currently duplicated across static pages.
Reason: The project has not yet introduced a backend/template system.

 Decision: The contact form is currently frontend-only.
Reason: Backend form processing has not yet been introduced.

 Decision: All images must be downloaded, renamed, placed in the correct folder, and recorded in ASSET-REGISTER.md before they are used in HTML.
Reason: This ensures the "no broken images" rule is enforced.
