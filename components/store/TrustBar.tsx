export default function TrustBar() {
  const items = [
    { icon: '🚚', label: 'Fast Delivery', sub: 'Across Bangladesh' },
    { icon: '💳', label: 'Cash on Delivery', sub: 'No upfront payment' },
    { icon: '↩️', label: 'Easy Returns', sub: '7-day return policy' },
    { icon: '🛡️', label: 'Secure Shopping', sub: '100% safe checkout' },
  ];

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
