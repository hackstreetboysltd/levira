"use client";

import { useState } from "react";
import SmoothButton from "@/components/smoothui/smooth-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contact } from "@/content/levira";

export function ContactPanel() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendInquiry() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        throw new Error("send failed");
      }
      setSent(true);
      setConfirmOpen(false);
      setMessage("");
    } catch {
      setError("Could not send inquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 safe-px sm:grid-cols-[1fr_1.05fr] sm:gap-10 sm:px-6 sm:py-20">
      <div className="min-w-0">
        <p className="text-sm font-medium tracking-[0.18em] text-cyan uppercase">
          {contact.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.85rem,6vw,3.4rem)] leading-[1.05] font-bold tracking-tight text-deep text-balance">
          {contact.title}
        </h1>
      </div>

      <form
        className="min-w-0 rounded-3xl border border-deep/10 bg-gradient-to-br from-paper via-mist/60 to-cyan/10 p-5 shadow-[0_30px_80px_-40px_rgba(6,26,42,0.45)] sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim()) {
            setError("Please enter a message.");
            return;
          }
          setError(null);
          setConfirmOpen(true);
        }}
      >
        <div className="grid gap-6">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-deep/70">
              How can we help?
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              className="w-full rounded-xl border border-deep/15 bg-paper/80 px-4 py-3 text-sm text-deep outline-none ring-cyan/40 transition focus:ring-2"
              placeholder="Program design, evaluation, research, policy, training…"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <SmoothButton
            type="submit"
            color="accent"
            variant="solid"
            size="lg"
            className="h-12 w-full min-h-11 rounded-xl sm:w-auto"
            disabled={sending}
          >
            {sent ? "Inquiry sent" : "Send inquiry"}
          </SmoothButton>
        </div>
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm send</DialogTitle>
            <DialogDescription>
              Message is about to be sent. Cancel or Proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={sendInquiry} disabled={sending}>
              {sending ? "Sending…" : "Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
