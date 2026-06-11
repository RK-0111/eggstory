import ProductCard from './ProductCard.jsx';

export default function ProductSection({ id, title, intro, products }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
