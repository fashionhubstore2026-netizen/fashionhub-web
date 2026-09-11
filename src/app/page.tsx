export default function HomePage() {
  return (
    <div>
      <section className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6 lg:py-32">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">New Season</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Discover premium fashion from curated vendors
          </h1>
          <p className="max-w-xl text-lg text-brand-muted">
            Clothes, jewellery, shoes, watches, bags and more — all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}
