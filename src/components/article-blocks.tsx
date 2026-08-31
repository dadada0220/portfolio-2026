"use client";

import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client";
import { Fragment } from "react";

import { thumbUrl } from "@/lib/thumb";

type Block = BlockObjectResponse;

function RichText({ value }: { value: RichTextItemResponse[] }) {
  return (
    <>
      {value.map((item, index) => {
        const { annotations } = item;
        let node = <>{item.plain_text}</>;

        if (annotations.code) {
          node = <code>{item.plain_text}</code>;
        }
        if (annotations.bold) node = <strong>{node}</strong>;
        if (annotations.italic) node = <em>{node}</em>;
        if (annotations.strikethrough) node = <s>{node}</s>;
        if (annotations.underline) node = <u>{node}</u>;
        if (item.href) {
          node = (
            <a href={item.href} target="_blank" rel="noreferrer noopener">
              {node}
            </a>
          );
        }

        return <Fragment key={index}>{node}</Fragment>;
      })}
    </>
  );
}

function imageUrl(block: Extract<Block, { type: "image" }>) {
  return block.image.type === "external"
    ? block.image.external.url
    : block.image.file.url;
}

/** 連続するリスト項目を ul / ol にまとめる */
type Group =
  | { kind: "block"; block: Block }
  | { kind: "list"; ordered: boolean; blocks: Block[] };

function groupBlocks(blocks: Block[]): Group[] {
  const groups: Group[] = [];

  for (const block of blocks) {
    const ordered = block.type === "numbered_list_item";
    const isListItem = ordered || block.type === "bulleted_list_item";
    const last = groups.at(-1);

    if (isListItem && last?.kind === "list" && last.ordered === ordered) {
      last.blocks.push(block);
    } else if (isListItem) {
      groups.push({ kind: "list", ordered, blocks: [block] });
    } else {
      groups.push({ kind: "block", block });
    }
  }

  return groups;
}

function renderBlock(block: Block, options: { thumbPageId?: string } = {}) {
  switch (block.type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) return null;
      return (
        <p>
          <RichText value={block.paragraph.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h2>
          <RichText value={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h2>
          <RichText value={block.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <RichText value={block.heading_3.rich_text} />
        </h3>
      );
    case "to_do":
      return (
        <p>
          <span aria-hidden>{block.to_do.checked ? "☑" : "☐"}</span>{" "}
          <RichText value={block.to_do.rich_text} />
        </p>
      );
    case "quote":
      return (
        <blockquote>
          <RichText value={block.quote.rich_text} />
        </blockquote>
      );
    case "callout":
      return (
        <blockquote>
          <RichText value={block.callout.rich_text} />
        </blockquote>
      );
    case "toggle":
      return (
        <p>
          <RichText value={block.toggle.rich_text} />
        </p>
      );
    case "code":
      return (
        <pre>
          <code>
            {block.code.rich_text.map((item) => item.plain_text).join("")}
          </code>
        </pre>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- Notionの署名URLは都度取得のため next/image を使わない
        <img
          // 先頭の画像は一覧のサムネイルと同じ画像。同じURL（/api/thumb）で読むことで
          // ブラウザキャッシュに当たり、モーダルを開いたときに読み直しが起きない
          src={options.thumbPageId ? thumbUrl(options.thumbPageId) : imageUrl(block)}
          alt={block.image.caption.map((item) => item.plain_text).join("")}
          loading={options.thumbPageId ? "eager" : "lazy"}
          decoding="async"
        />
      );
    case "divider":
      return <hr />;
    case "bookmark":
      return (
        <p>
          <a
            href={block.bookmark.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {block.bookmark.url}
          </a>
        </p>
      );
    case "embed":
      return (
        <p>
          <a href={block.embed.url} target="_blank" rel="noreferrer noopener">
            {block.embed.url}
          </a>
        </p>
      );
    default:
      return null;
  }
}

export function ArticleBlocks({
  blocks,
  pageId,
}: {
  blocks: Block[];
  /** 渡すと、先頭の画像ブロックを一覧と同じ `/api/thumb/[pageId]` で読む */
  pageId?: string;
}) {
  if (blocks.length === 0) return null;

  const leadingImageId =
    pageId && blocks[0]?.type === "image" ? blocks[0].id : undefined;
  const groups = groupBlocks(blocks);
  const rendered = groups.map((group, index) => {
    if (group.kind === "list") {
      const ListTag = group.ordered ? "ol" : "ul";
      return (
        <ListTag key={index}>
          {group.blocks.map((block) => (
            <li key={block.id}>
              <RichText
                value={
                  block.type === "numbered_list_item"
                    ? block.numbered_list_item.rich_text
                    : block.type === "bulleted_list_item"
                      ? block.bulleted_list_item.rich_text
                      : []
                }
              />
            </li>
          ))}
        </ListTag>
      );
    }
    const node = renderBlock(group.block, {
      thumbPageId: group.block.id === leadingImageId ? pageId : undefined,
    });
    return node ? <Fragment key={group.block.id}>{node}</Fragment> : null;
  });

  if (rendered.every((node) => node === null)) return null;

  return <div className="prose-work">{rendered}</div>;
}
