/**
 * The CMS framework. Import from here when building a new admin screen —
 * everything needed to assemble a page already exists.
 *
 * See `docs/CMS.md` for the recipe.
 */
export * from "./layout";
export * from "./data";
export * from "./feedback";
export * from "./dashboard/blocks";
export * from "./forms/form";
export { useAdminForm } from "./forms/use-admin-form";
export { EditorForm, FormSection } from "./forms/editor-form";
export { ImageFormField } from "./forms/image-form-field";
export { CheckboxFormField } from "./forms/checkbox-form-field";
export { Can } from "./permissions/can";
export { Dropzone } from "./media/dropzone";
export { MediaCard, type MediaCardItem } from "./media/media-card";
// `ImageField` is intentionally NOT exported: inside a form it must be bound to
// React Hook Form, which is what `ImageFormField` does. Exposing the raw
// control invites the "picked an image, saved nothing" bug it replaced.
export { MediaPicker } from "./media/media-picker";
