import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import CartonDiagram from './CartonDiagram.jsx';
import { formatRupees } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const perEgg = (product.pricePaise / product.packSize / 100).toFixed(1);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card">
      <CartonDiagram packSize={product.packSize} category={product.category} />
      <div>
        <span className="pack-label">Pack of {product.packSize}</span>
        <h3>{product.name}</h3>
      </div>
      <p className="tagline">{product.tagline}</p>
      <div className="price-row">
        <span className="price">{formatRupees(product.pricePaise)}</span>
        <span className="per-egg">₹{perEgg} / egg</span>
      </div>
      {typeof product.stock === 'number' && product.stock > 0 && product.stock < 10 && (
        <span className="stock-note">Only {product.stock} left today</span>
      )}
      <button
        className={`add-btn ${added ? 'added' : ''}`}
        onClick={handleAdd}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of stock' : added ? 'Added to cart ✓' : 'Add to cart'}
      </button>
    </article>
  );
}
