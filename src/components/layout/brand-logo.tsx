import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

export function BrandLogo({ href = '/', className = '', size = 'md' }: BrandLogoProps) {
  const logo = (
    <span
      className={`inline-flex items-baseline font-sans font-semibold tracking-[0.12em] ${sizeClasses[size]} ${className}`}
      aria-label="FashionHub"
    >
      <span className="text-brand-dark">FASHION</span>
      <span className="relative text-brand">
        H
        <span className="relative inline-block">
          <span
            className="absolute -top-[0.55em] left-1/2 -translate-x-1/2 text-[0.55em] leading-none text-brand"
            aria-hidden
          >
            ^
          </span>
          U
        </span>
        B
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {logo}
      </Link>
    );
  }

  return <div className="inline-flex shrink-0 items-center">{logo}</div>;
}
