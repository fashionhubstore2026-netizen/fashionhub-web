'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const params = useSearchParams();
  const query = (params.get('q') ?? '').trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-brand-dark">
        {query ? `Results for “${query}”` : 'Search'}
      </h1>
      <p className="mt-2 text-brand-secondary">
        {query
          ? 'Product search is coming soon. This page opens when a carousel slide keyword is clicked.'
          : 'Enter a keyword from the header search to look for products.'}
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-brand-muted">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
