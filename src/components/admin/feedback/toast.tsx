"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { Toast } from "radix-ui";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
type ToastMessage = { id: number; title: string; description?: string; tone: ToastTone };

type ToastContextValue = {
  notify: (message: Omit<ToastMessage, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * The CMS notification area.
 *
 * Radix `Toast` gives an ARIA live region, swipe-to-dismiss and hover-to-pause
 * for free. Errors persist until dismissed while successes auto-hide — a
 * failure should never scroll away before it's read.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = useCallback((message: Omit<ToastMessage, "id">) => {
    setMessages((current) => [...current, { ...message, id: Date.now() + Math.random() }]);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      success: (title, description) => notify({ title, description, tone: "success" }),
      error: (title, description) => notify({ title, description, tone: "error" }),
    }),
    [notify],
  );

  const icons: Record<ToastTone, ReactNode> = {
    success: <CheckCircle2 className="size-4 text-success" aria-hidden />,
    error: <TriangleAlert className="size-4 text-danger" aria-hidden />,
    info: <Info className="size-4 text-primary" aria-hidden />,
  };

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right">
        {children}

        {messages.map((message) => (
          <Toast.Root
            key={message.id}
            duration={message.tone === "error" ? Infinity : 5000}
            onOpenChange={(open) => {
              if (!open) setMessages((current) => current.filter((m) => m.id !== message.id));
            }}
            className="flex animate-fade items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-lg"
          >
            {icons[message.tone]}
            <div className="min-w-0 flex-1">
              <Toast.Title className="text-small font-medium text-foreground">
                {message.title}
              </Toast.Title>
              {message.description ? (
                <Toast.Description className="mt-0.5 text-caption text-muted-foreground">
                  {message.description}
                </Toast.Description>
              ) : null}
            </div>
            <Toast.Close
              aria-label="Dismiss"
              className={cn(
                "rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground",
                focusRing,
              )}
            >
              <X className="size-4" aria-hidden />
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed right-0 bottom-0 z-[var(--z-toast)] flex w-[min(24rem,96vw)] flex-col gap-2 p-4 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

/** Show a notification from any Client Component inside the admin shell. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}
