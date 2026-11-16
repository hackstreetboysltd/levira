"use client";

import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import SmoothButton from "@/components/smoothui/smooth-button";
import { CopyButton } from "@/components/unlumen-ui/copy";
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

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 safe-px sm:grid-cols-[1fr_1.05fr] sm:gap-10 sm:px-6 sm:py-20">
      <div className="min-w-0">
        <p className="text-sm font-medium tracking-[0.18em] text-cyan uppercase">
          {contact.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.85rem,6vw,3.4rem)] leading-[1.05] font-bold tracking-tight text-deep text-balance">
          {contact.title}
        </h1>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-deep/10 bg-paper/80 px-4 py-3">
            <div>
              <p className="text-xs tracking-[0.14em] text-deep/45 uppercase">
                Email
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block text-sm font-medium text-deep hover:text-cyan"
              >
                {contact.email}
              </a>
            </div>
            <CopyButton content={contact.email} variant="outline" />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-deep/10 bg-paper/80 px-4 py-3">
            <div className="flex items-start gap-3">
              <Phone className="mt-1 size-4 text-cyan" />
              <div>
                <p className="text-xs tracking-[0.14em] text-deep/45 uppercase">
                  Phone
                </p>
                <a
                  href={contact.phoneHref}
                  className="mt-1 block text-sm font-medium text-deep hover:text-cyan"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
            <CopyButton content={contact.phone} variant="outline" />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-deep/10 bg-paper/80 px-4 py-3">
            <MapPin className="mt-1 size-4 text-cyan" />
            <div>
              <p className="text-xs tracking-[0.14em] text-deep/45 uppercase">
                Location
              </p>
              <p className="mt-1 text-sm font-medium text-deep">
                {contact.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        className="min-w-0 rounded-3xl border border-deep/10 bg-gradient-to-br from-paper via-mist/60 to-cyan/10 p-5 shadow-[0_30px_80px_-40px_rgba(6,26,42,0.45)] sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmOpen(true);
        }}
      >
        <p className="font-display text-2xl font-semibold text-deep">
          Inquiry
        </p>
        <p className="mt-1 text-sm text-deep/60">
          Tell us about the assignment. This form is UI-only for now.
        </p>

        <div className="mt-8 grid gap-6">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-deep/70">
              How can we help?
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-deep/15 bg-paper/80 px-4 py-3 text-sm text-deep outline-none ring-cyan/40 transition focus:ring-2"
              placeholder="Program design, evaluation, research, policy, training…"
            />
          </label>

          <SmoothButton
            type="submit"
            color="accent"
            variant="solid"
            size="lg"
            className="h-12 w-full min-h-11 rounded-xl sm:w-auto"
          >
            {sent ? "Message captured (demo)" : "Send inquiry"}
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
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSent(true);
                setConfirmOpen(false);
              }}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
