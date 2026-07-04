export default function Loading() {
  return (
    <div className="splash-loader" role="status" aria-live="polite">
      <div className="splash-loader__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="splash-loader__brand">ACZ Store</p>
      <p className="splash-loader__label">Loading products</p>
    </div>
  );
}
