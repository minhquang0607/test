import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper border-2 border-ink shadow-[3px_3px_0_var(--color-pink)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-pink)] active:translate-y-0 active:shadow-none",
        pop: "bg-lime text-ink border-2 border-ink shadow-pop hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none",
        outline: "bg-white text-ink border-2 border-ink hover:bg-paper",
        ghost: "text-ink hover:bg-ink/5",
        danger: "bg-danger text-white border-2 border-ink hover:brightness-95",
      },
      size: {
        sm: "h-9 rounded-xl px-3 text-sm",
        md: "h-11 rounded-2xl px-5 text-[15px]",
        lg: "h-14 rounded-2xl px-7 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
