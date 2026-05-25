import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";

const CONTENT_ROOT = path.join(process.cwd(), "content", "modules");

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "details",
    "summary",
    "pre",
    "code",
    "span",
    "div",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "sup",
    "sub",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class", "id", "style"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt"],
    code: ["class"],
    pre: ["class"],
  },
};

export function getLessonHtml(moduleId: number, subSlug: string): string | null {
  const lessonPath = path.join(
    CONTENT_ROOT,
    String(moduleId),
    `${subSlug}-lesson.html`
  );
  if (!fs.existsSync(lessonPath)) {
    const mod = getModuleDir(moduleId);
    if (!mod) return null;
    const files = fs.readdirSync(mod).filter((f) => f.endsWith(".html") && !f.includes("-lesson"));
    const match = files.find((f) => f.includes(subSlug.replace("-", ".")));
    if (match) {
      const raw = fs.readFileSync(path.join(mod, match), "utf-8");
      return sanitizeHtml(raw.replace(/<section[^>]*assessment-section[\s\S]*?<\/section>/gi, ""), sanitizeOptions);
    }
    return null;
  }
  const raw = fs.readFileSync(lessonPath, "utf-8");
  return sanitizeHtml(raw, sanitizeOptions);
}

function getModuleDir(moduleId: number): string | null {
  const dir = path.join(CONTENT_ROOT, String(moduleId));
  return fs.existsSync(dir) ? dir : null;
}
