import Image from "next/image";

/**
 * The Yeam mark.
 *
 * logo-hd.png is a square mark; the "yeam" wordmark beside it in the nav is
 * separate type. The mark sits still in the header and footer, kept plain and
 * professional. Shared by Nav and Footer so both marks match.
 */
export default function LogoMark({
  size = 34,
  priority = false,
  className = "",
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex ${className}`}>
      <Image src="/logo-hd.png" alt="Yeam" width={size} height={size} priority={priority} />
    </span>
  );
}
