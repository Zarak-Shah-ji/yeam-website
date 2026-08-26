/**
 * Shared reduced-motion guard.
 *
 * Lifted out of Hero and Integrations, which each carried a byte-identical copy.
 * The CSS backstop in globals.css stops the ambient loops; this is what the
 * JS-driven timelines check before they build anything.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
