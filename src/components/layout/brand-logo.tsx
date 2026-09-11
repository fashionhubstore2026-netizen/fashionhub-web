import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeHeights = {
  sm: 25,
  md: 22,
  lg: 40,
};

export function BrandLogo({ href = '/', className = '', size = 'md' }: BrandLogoProps) {
  const height = sizeHeights[size];
  const image = (
    <Image
      src="/logo.png"
      alt="FashionHub"
      width={Math.round(height * 3.2)}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ maxHeight: height, width: 'auto', height: 'auto' }}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <div className="inline-flex shrink-0 items-center">{image}</div>;
}
