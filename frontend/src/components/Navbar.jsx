import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { count, openCart } = useCart();
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#top" className="brand">
          <span className="brand-egg" aria-hidden="true" />
          The egg story
        </a>
        <nav className="nav-links" aria-label="Main">
          <a href="#brown-eggs">Brown eggs</a>
          <a href="#quail-eggs">Quail eggs</a>
          <a href="#our-farm">Our farm</a>
          <button className="cart-btn" onClick={openCart}>
            Cart <span className="cart-count">{count}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
