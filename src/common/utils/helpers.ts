// import slugify from "slugify";
import crypto from "crypto";

// export function generateSlug(str: string) {
//   return slugify(str, {
//     lower: true,
//     strict: true,
//     trim: true,
//   });
// }

export function hashString(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
