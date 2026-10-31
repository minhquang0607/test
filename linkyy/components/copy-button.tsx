"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="pop"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Copy rồi nha, dán lên bio thôi ✨");
          setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error("Không copy được, bôi đen rồi copy tay giúp mình nha");
        }
      }}
    >
      {copied ? "Đã copy ✓" : label}
    </Button>
  );
}
