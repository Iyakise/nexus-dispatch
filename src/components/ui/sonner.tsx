"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** App-wide toast host. Mount once in the root layout; call `toast()` anywhere. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-border !bg-white !text-on-surface !shadow-flyout !font-sans !text-body-md",
          description: "!text-on-surface-variant !text-body-sm",
          actionButton: "!bg-action !text-white !rounded-lg",
          cancelButton: "!bg-slate-100 !text-on-surface !rounded-lg",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
