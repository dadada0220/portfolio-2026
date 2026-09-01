"use client";

import { useActionState } from "react";
import { CheckCircle2, Send, TriangleAlert } from "lucide-react";

import { submitContact, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p className="text-xs text-destructive">{messages.join(" / ")}</p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="surface-card flex flex-col items-start gap-2 p-6">
        <CheckCircle2 aria-hidden className="size-[18px] text-foreground" />
        <p className="text-sm font-medium">送信しました</p>
        <p className="text-sm text-muted-foreground">
          {state.message ?? "3営業日以内にご返信します。"}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="surface-card flex max-w-xl flex-col gap-5 p-6"
    >
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">お名前</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          defaultValue={state.values?.name}
          aria-invalid={Boolean(state.errors?.name)}
        />
        <FieldError messages={state.errors?.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(state.errors?.email)}
        />
        <FieldError messages={state.errors?.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">お問い合わせ内容</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={8}
          maxLength={4000}
          defaultValue={state.values?.message}
          aria-invalid={Boolean(state.errors?.message)}
          placeholder="ご相談の背景や、現在お困りのことをお書きください。決まっていない段階でも構いません。"
        />
        <FieldError messages={state.errors?.message} />
      </div>

      {/* honeypot: スクリーンリーダーとタブ移動からも外す */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">会社名（入力しないでください）</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          <Send data-icon="inline-start" />
          {pending ? "送信中..." : "送信する"}
        </Button>
      </div>
    </form>
  );
}
