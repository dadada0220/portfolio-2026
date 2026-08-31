"use server";

import { Resend } from "resend";
import { z } from "zod";

import { site } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** フィールドごとのエラー。キーはフォームの name */
  errors?: Partial<Record<"name" | "email" | "message", string[]>>;
  /** 再入力の手間を減らすため、失敗時は入力値を戻す */
  values?: { name: string; email: string; message: string };
};

const schema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(100),
  email: z.email("メールアドレスの形式が正しくありません").max(200),
  message: z
    .string()
    .trim()
    .min(10, "10文字以上でご入力ください")
    .max(4000, "4000文字以内でご入力ください"),
});

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // honeypot: 人間には見えないフィールド。埋まっていたら黙って成功扱いにする
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success" };
  }

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "入力内容をご確認ください。",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY が設定されていません");
    return {
      status: "error",
      message:
        "送信機能が設定されていません。お手数ですが直接メールでご連絡ください。",
      values,
    };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: `お問い合わせフォーム <${from}>`,
      to: [to],
      replyTo: parsed.data.email,
      subject: `[ポートフォリオ] ${parsed.data.name} さんからお問い合わせ`,
      text: [
        `お名前: ${parsed.data.name}`,
        `メール: ${parsed.data.email}`,
        "",
        parsed.data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend からエラーが返りました", error);
      return {
        status: "error",
        message:
          "送信に失敗しました。しばらく時間をおいて、もう一度お試しください。",
        values,
      };
    }
  } catch (error) {
    console.error("[contact] 送信に失敗しました", error);
    return {
      status: "error",
      message:
        "送信に失敗しました。しばらく時間をおいて、もう一度お試しください。",
      values,
    };
  }

  return {
    status: "success",
    message: "送信しました。3営業日以内にご返信します。",
  };
}
