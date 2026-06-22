import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import CartonDiagram from './CartonDiagram.jsx';
import { formatRupees } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation between -5 and 5 degrees
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article 
      ref={cardRef}
      className="product-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      <CartonDiagram packSize={product.packSize} category={product.category} />
      <div style={{ transform: 'translateZ(30px)' }}>
        <span className="pack-label" style={{ transform: 'translateZ(20px)', display: 'inline-block' }}>Pack of {product.packSize}</span>
        <h3 style={{ transform: 'translateZ(30px)' }}>{product.name}</h3>
      </div>
      <p className="tagline" style={{ transform: 'translateZ(25px)' }}>{product.tagline}</p>
      <div className="price-row" style={{ transform: 'translateZ(30px)' }}>
        <span className="price">{formatRupees(product.pricePaise)}</span>
        <span className="per-egg">Rs {perEgg} / egg</span>
      </div>
      {typeof product.stock === 'number' && product.stock > 0 && product.stock < product.packSize * 3 && (
        <span className="stock-note" style={{ transform: 'translateZ(20px)' }}>Only {product.stock} eggs left today</span>
      )}
      <button
        className={`add-btn ${added ? 'added' : ''}`}
        onClick={handleAdd}
        disabled={isOutOfStock}
        style={{ transform: 'translateZ(40px)' }}
      >
        {isOutOfStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
      </button>
    </article>
  );
}
