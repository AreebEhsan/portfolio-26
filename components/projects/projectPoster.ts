"use client";

import type { MergedProject } from "@/lib/projects";

/**
 * There are no image assets for the projects, so each gallery item is a card
 * face drawn on a canvas: title, description and tag pills rendered in the
 * site's own visual language (near-black field, cyan accent, slate hairline,
 * Geist type) and uploaded as a WebGL texture.
 *
 * A real screenshot is still preferred whenever one genuinely loads, so adding
 * files under public/images/projects/ later upgrades the gallery with no code
 * change.
 */

/** Matches the gallery plane's 700x900 aspect, so nothing is cropped. */
const W = 700;
const H = 900;

export type PosterItem = { image: string; text: string };

/**
 * Type scale. The plane always occupies ~60% of the container height, so
 * on-screen text size is proportional to that height: at a 620px container the
 * card is ~372px tall and a 34px glyph here lands at ~14px on screen.
 *
 * On narrow viewports the card is far smaller, so the compact variant drops the
 * description and enlarges everything rather than rendering text too small to
 * read.
 */
const TYPE = {
  full: { title: 58, titleLead: 68, titleLines: 3, desc: 34, descLead: 46, descLines: 4, tag: 26, meta: 24 },
  compact: { title: 74, titleLead: 86, titleLines: 4, desc: 0, descLead: 0, descLines: 0, tag: 34, meta: 30 },
} as const;

async function fontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await document.fonts.load("600 58px Geist");
    await document.fonts.load("400 34px Geist");
    await document.fonts.load('500 26px "Geist Mono"');
    await document.fonts.ready;
  } catch {
    // Fall back to whatever the browser provides.
  }
}

/**
 * Splits on whitespace, then again after any -, _ or / so that repo-style
 * titles ("research-assistant-extension") have somewhere to break. Tokens that
 * are still too wide for the card are cut by character as a last resort.
 */
function tokenize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const tokens = text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => word.split(/(?<=[-_/])/));

  const fitted: string[] = [];
  for (const token of tokens) {
    if (ctx.measureText(token).width <= maxWidth) {
      fitted.push(token);
      continue;
    }
    let chunk = "";
    for (const char of token) {
      if (chunk && ctx.measureText(chunk + char).width > maxWidth) {
        fitted.push(chunk);
        chunk = char;
      } else {
        chunk += char;
      }
    }
    if (chunk) fitted.push(chunk);
  }
  return fitted;
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = tokenize(ctx, text, maxWidth);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    // No space after a separator the token was split on, so hyphenated names
    // rejoin cleanly rather than gaining a gap.
    const joiner = line && !/[-_/]$/.test(line) ? " " : "";
    const candidate = line ? `${line}${joiner}${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);

  const last = lines[lines.length - 1];
  const overflowed = lines.length === maxLines && line && lines[maxLines - 1] !== line;

  if (last && (ctx.measureText(last).width > maxWidth || overflowed)) {
    let trimmed = last;
    while (trimmed && ctx.measureText(`${trimmed}…`).width > maxWidth) {
      trimmed = trimmed.slice(0, -1).trimEnd();
    }
    lines[lines.length - 1] = `${trimmed}…`;
  }

  return lines;
}

/** ctx.roundRect is recent; this keeps the pills working on older engines. */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawPoster(
  project: MergedProject,
  index: number,
  compact: boolean,
): string {
  const t = compact ? TYPE.compact : TYPE.full;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  /* ---- surface ---- */

  const field = ctx.createLinearGradient(0, 0, W * 0.6, H);
  field.addColorStop(0, "#0b1524");
  field.addColorStop(0.55, "#05080f");
  field.addColorStop(1, "#03050a");
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, W, H);

  const bloom = ctx.createRadialGradient(W * 0.18, H * 0.08, 0, W * 0.18, H * 0.08, W);
  bloom.addColorStop(0, "rgba(34, 211, 238, 0.22)");
  bloom.addColorStop(0.45, "rgba(34, 211, 238, 0.05)");
  bloom.addColorStop(1, "rgba(34, 211, 238, 0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(148, 163, 184, 0.09)";
  for (let y = 46; y < H; y += 40) {
    for (let x = 46; x < W; x += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Inset hairline — the shader rounds the plane, so keep this clear of the corners.
  ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, W - 32, H - 32, 26);
  ctx.stroke();

  const pad = 62;
  const inner = W - pad * 2;
  ctx.textBaseline = "top";

  /* ---- meta row ---- */

  ctx.font = `500 ${t.meta}px "Geist Mono", ui-monospace, monospace`;
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(103, 232, 249, 0.9)";
  ctx.fillText(String(index + 1).padStart(2, "0"), pad, pad);

  if (project.stars != null && project.stars > 0) {
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(228, 228, 231, 0.7)";
    ctx.fillText(`★ ${project.stars}`, W - pad, pad);
    ctx.textAlign = "left";
  }

  /* ---- tag pills, bottom anchored ---- */

  const tags = (project.techStack ?? project.highlightTags ?? []).slice(0, compact ? 3 : 4);
  const pillH = Math.round(t.tag * 2.05);
  const pillGap = 14;
  const rows: { label: string; w: number }[][] = [];

  if (tags.length) {
    ctx.font = `500 ${t.tag}px "Geist Mono", ui-monospace, monospace`;
    let row: { label: string; w: number }[] = [];
    let rowW = 0;

    for (const tag of tags) {
      const w = Math.ceil(ctx.measureText(tag).width) + t.tag * 1.7;
      if (row.length && rowW + pillGap + w > inner) {
        rows.push(row);
        row = [];
        rowW = 0;
      }
      row.push({ label: tag, w });
      rowW += (row.length > 1 ? pillGap : 0) + w;
    }
    if (row.length) rows.push(row);
  }

  const tagsBlockH = rows.length ? rows.length * pillH + (rows.length - 1) * pillGap : 0;
  const tagsTop = H - pad - tagsBlockH;

  rows.forEach((row, rowIndex) => {
    let x = pad;
    const y = tagsTop + rowIndex * (pillH + pillGap);
    for (const pill of row) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
      roundRect(ctx, x, y, pill.w, pillH, pillH / 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.42)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.fillStyle = "rgba(228, 228, 231, 0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(pill.label, x + pill.w / 2, y + pillH / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      x += pill.w + pillGap;
    }
  });

  /* ---- title + description, stacked upward from the tags ---- */

  const description = compact ? "" : (project.problem ?? project.description ?? "").trim();

  ctx.font = `600 ${t.title}px Geist, system-ui, sans-serif`;
  const titleLines = wrap(ctx, project.title, inner, t.titleLines);

  let descLines: string[] = [];
  if (description && t.descLines) {
    ctx.font = `400 ${t.desc}px Geist, system-ui, sans-serif`;
    descLines = wrap(ctx, description, inner, t.descLines);
  }

  const titleBlockH = titleLines.length * t.titleLead;
  const descBlockH = descLines.length ? descLines.length * t.descLead + 20 : 0;
  const contentBottom = tagsTop - (rows.length ? 40 : 0);

  let cursor = contentBottom - descBlockH - titleBlockH;
  // Never collide with the meta row on unusually long content.
  cursor = Math.max(cursor, pad + t.meta + 40);

  ctx.font = `600 ${t.title}px Geist, system-ui, sans-serif`;
  ctx.fillStyle = "#fafafa";
  for (const line of titleLines) {
    ctx.fillText(line, pad, cursor);
    cursor += t.titleLead;
  }

  if (descLines.length) {
    cursor += 20;
    ctx.font = `400 ${t.desc}px Geist, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(161, 161, 170, 0.95)";
    for (const line of descLines) {
      ctx.fillText(line, pad, cursor);
      cursor += t.descLead;
    }
  }

  return canvas.toDataURL("image/png");
}

/**
 * Resolves true only if the browser can actually decode the file. The declared
 * screenshot paths are currently 404s, so trusting the metadata alone would put
 * broken textures in the gallery.
 */
function canLoad(src: string) {
  return new Promise<boolean>((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(probe.naturalWidth > 0);
    probe.onerror = () => resolve(false);
    probe.src = src;
  });
}

/**
 * Builds the gallery's item list from live project data. Await from an effect —
 * it waits on webfonts and on the screenshot probes.
 *
 * `text` is intentionally empty: the card face already carries the title, so the
 * component's separate caption mesh would only duplicate it.
 */
export async function buildPosterItems(
  projects: MergedProject[],
  { compact = false }: { compact?: boolean } = {},
): Promise<PosterItem[]> {
  await fontsReady();

  return Promise.all(
    projects.map(async (project, index) => {
      const declared = project.screenshots?.[0]?.src;
      const usable = declared ? await canLoad(declared) : false;

      return {
        image: usable && declared ? declared : drawPoster(project, index, compact),
        text: "",
      };
    }),
  );
}
