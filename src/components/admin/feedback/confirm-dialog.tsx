"use client";

import { AlertTriangle } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { type ReactNode, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Confirmation for consequential actions (Radix `AlertDialog`: focus-trapped,
 * Escape-dismissable, and announced as an alert).
 *
 * Two deliberate safety choices:
 *  - `destructive` styles the action and shows a warning icon, so a delete
 *    never looks like an ordinary confirm.
 *  - `confirmPhrase` requires the user to type an exact value (e.g. the item's
 *    name) before the button enables — reserved for irreversible actions.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  confirmPhrase,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: {
  /** Omit when driving the dialog with `open` — e.g. from a row menu, which
   *  unmounts on close and would take a nested trigger with it. */
  trigger?: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  confirmPhrase?: string;
  onConfirm: () => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [isPending, startTransition] = useTransition();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const phraseSatisfied = !confirmPhrase || typed.trim() === confirmPhrase;

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm();
      setOpen(false);
      setTyped("");
    });
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTyped("");
      }}
    >
      {trigger ? <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger> : null}

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[var(--z-modal)] animate-fade bg-overlay" />
        <AlertDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[var(--z-modal)] w-[min(28rem,92vw)] animate-fade",
            "-translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl focus:outline-none",
          )}
        >
          <div className="flex gap-3">
            {destructive ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                <AlertTriangle className="size-5" aria-hidden />
              </span>
            ) : null}

            <div className="min-w-0 flex-1">
              <AlertDialog.Title className="text-h5 font-semibold text-foreground">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1.5 text-small text-muted-foreground">
                {description}
              </AlertDialog.Description>

              {confirmPhrase ? (
                <label className="mt-4 block text-small">
                  <span className="text-muted-foreground">
                    Type <strong className="font-medium text-foreground">{confirmPhrase}</strong> to
                    confirm
                  </span>
                  <input
                    value={typed}
                    onChange={(event) => setTyped(event.target.value)}
                    autoComplete="off"
                    className="mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
                  />
                </label>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm" disabled={isPending}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <Button
              size="sm"
              variant={destructive ? "destructive" : "primary"}
              loading={isPending}
              disabled={!phraseSatisfied}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
