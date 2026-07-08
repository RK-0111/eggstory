import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import CartonDiagram from './CartonDiagram.jsx';
import { formatRupees } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const perEgg = (product.pricePaise / product.packSize / 100).toFixed(1);
  const availablePacks =
    typeof product.stock === 'number' ? Math.floor(product.stock / product.packSize) : Infinity;
  const isOutOfStock = availablePacks < 1;

  const handleAdd = () => {
    if (isOutOfStock) return;
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
        <span className="per-egg">Rs {perEgg} / egg</span>
      </div>
      {typeof product.stock === 'number' && product.stock > 0 && product.stock < product.packSize * 3 && (
        <span className="stock-note">Only {product.stock} eggs left today</span>
      )}
      <button
        className={`add-btn ${added ? 'added' : ''}`}
        onClick={handleAdd}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
      </button>
    </article>
  );
}
