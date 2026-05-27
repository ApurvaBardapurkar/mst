/** Remove emoji and variation-selector characters from display text. */
export function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}
