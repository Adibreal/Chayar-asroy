import { cn } from "@/lib/utils";

import { ContactCard, type ContactItem } from "./contact-card";

/** A responsive grid of contact methods. */
export function ContactInfo({ items, className }: { items: ContactItem[]; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <ContactCard key={item.label} {...item} />
      ))}
    </div>
  );
}
