import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Resolve public dir: in dev it's `public/`, in production it's `.output/public/`
const cwd = process.cwd();
const publicDir = existsSync(resolve(cwd, "public/og-logo.png"))
  ? resolve(cwd, "public")
  : resolve(cwd, ".output/public");

// Read assets once at module load
const logoBase64 = readFileSync(resolve(publicDir, "og-logo.png")).toString(
  "base64",
);
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

const fontRegular = readFileSync(resolve(publicDir, "fonts/Inter-Regular.ttf"));
const fontBold = readFileSync(resolve(publicDir, "fonts/Inter-Bold.ttf"));

export async function generateQuizOgImage(
  title: string,
  description?: string,
): Promise<Buffer> {
  const truncatedTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const truncatedDesc = description
    ? description.length > 140
      ? description.slice(0, 137) + "..."
      : description
    : "";

  // Build satori markup as plain objects (avoids satori-html/ultrahtml Bun crash)
  const descChildren = truncatedDesc
    ? [
        {
          type: "div",
          props: {
            style: {
              fontSize: 18,
              color: "#8b949e",
              lineHeight: 1.5,
              marginTop: 8,
            },
            children: truncatedDesc,
          },
        },
      ]
    : [];

  const markup = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: 1200,
        height: 630,
        background: "#0d1117",
        fontFamily: "Inter",
        padding: 60,
        position: "relative" as const,
        overflow: "hidden",
      },
      children: [
        // Glow top-right
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(31,111,235,0.12) 0%, transparent 70%)",
              borderRadius: 200,
              display: "flex",
            },
          },
        },
        // Glow bottom-left
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              bottom: -80,
              left: -80,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
              borderRadius: 150,
              display: "flex",
            },
          },
        },
        // Main content column
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between",
              flex: 1,
              height: "100%",
            },
            children: [
              // Top: logo + brand
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 16 },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: logoDataUrl,
                        style: { width: 48, height: 48 },
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#c9d1d9",
                        },
                        children: "QuizOxide",
                      },
                    },
                  ],
                },
              },
              // Middle: quiz info
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 12,
                    flex: 1,
                    justifyContent: "center",
                    padding: "30px 0",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 14,
                          fontWeight: 400,
                          color: "#8b949e",
                          textTransform: "uppercase" as const,
                          letterSpacing: 2,
                        },
                        children: "Quiz",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 48,
                          fontWeight: 700,
                          color: "#e6edf3",
                          lineHeight: 1.2,
                        },
                        children: truncatedTitle,
                      },
                    },
                    ...descChildren,
                  ],
                },
              },
              // Bottom: site URL
              {
                type: "div",
                props: {
                  style: { display: "flex", fontSize: 16, color: "#8b949e" },
                  children: "quizoxide.soberdev.net",
                },
              },
            ],
          },
        },
        // Right accent bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: 4,
              height: "100%",
              background:
                "linear-gradient(to bottom, #f97316, #dc2626, #1f6feb)",
              borderRadius: 4,
              marginLeft: 60,
              flexShrink: 0,
            },
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return Buffer.from(resvg.render().asPng());
}

export async function generateHomeOgImage(): Promise<Buffer> {
  const markup = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: 1200,
        height: 630,
        background: "#ffffff",
        fontFamily: "Inter",
        padding: 50,
        position: "relative" as const,
        overflow: "hidden",
      },
      children: [
        // Subtle pink/warm glow top-left behind logo area
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              top: -40,
              left: -40,
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(251,191,191,0.35) 0%, transparent 70%)",
              borderRadius: 250,
              display: "flex",
            },
          },
        },
        // Left side: logo (no border box)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 420,
              height: "100%",
              flexShrink: 0,
              paddingRight: 40,
            },
            children: [
              {
                type: "img",
                props: {
                  src: logoDataUrl,
                  style: { width: 420, height: 420 },
                },
              },
            ],
          },
        },
        // Right side: content (dense)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "center",
              flex: 1,
              height: "100%",
            },
            children: [
              // Site URL
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 16,
                    color: "#9ca3af",
                    marginBottom: 14,
                  },
                  children: "quizoxide.soberdev.net",
                },
              },
              // Title
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.2,
                  },
                  children:
                    "QuizOxide - API-First Quiz Platform Built with Rust",
                },
              },
              // Read more button
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: 24,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingLeft: 28,
                          paddingRight: 28,
                          paddingTop: 12,
                          paddingBottom: 12,
                          borderRadius: 24,
                          background: "#111827",
                          color: "#ffffff",
                          fontSize: 16,
                          fontWeight: 700,
                        },
                        children: "Read more",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return Buffer.from(resvg.render().asPng());
}
