import { useCallback, useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext.jsx';
import { fetchProducts } from './api/products.js';
import { useStockStream } from './hooks/useStockStream.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProductSection from './components/ProductSection.jsx';
import StoryStrip from './components/StoryStrip.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';

/**
 * The page is composed of independent sections. To add a new module
 * (testimonials, delivery FAQ, subscriptions...), build a component in
 * /components and drop it into the layout below.
 */
export default function App() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setLoadError(err.message));
  }, []);

  // Live stock via pub-sub: merge every change broadcast by the backend
  const applyStockChanges = useCallback((changes) => {
    setProducts((prev) =>
      prev.map((p) => {
        const change = changes.find((c) => c.id === p.id);
        return change ? { ...p, stock: change.stock } : p;
      })
    );
  }, []);
  useStockStream(applyStockChanges);

  const brownEggs = products.filter((p) => p.category === 'brown');
  const quailEggs = products.filter((p) => p.category === 'quail');

  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        {loadError ? (
          <div className="container" style={{ padding: '40px 24px' }}>
            <p className="pay-error">
              Couldn&apos;t load products: {loadError}. Is the backend running on port 5000?
            </p>
          </div>
        ) : (
          <>
            <ProductSection
              id="brown-eggs"
              title="Free range brown eggs"
              intro="Rich yolks and strong shells from hens that spend their days on open pasture. Bigger packs, better value."
              products={brownEggs}
            />
            <ProductSection
              id="quail-eggs"
              title="Quail eggs"
              intro="Delicate, speckled, and packed with flavour — perfect boiled, fried, or as a garnish."
              products={quailEggs}
            />
          </>
        )}
        <StoryStrip />
      </main>
      <CartDrawer />
      <Footer />
    </CartProvider>
  );
}
