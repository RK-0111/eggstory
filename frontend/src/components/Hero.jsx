export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Pasture raised · Delivered fresh</span>
          <h1>
            Eggs the way the <em>hen</em> intended.
          </h1>
          <p className="lede">
            Free range brown eggs and speckled quail eggs, collected each
            morning and packed the same day. Pick a pack, pay online, and
            we bring breakfast to your door.
          </p>
          <div className="hero-actions">
            <a href="#brown-eggs" className="btn-primary">Shop brown eggs</a>
            <a href="#quail-eggs" className="btn-ghost">Shop quail eggs</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="big-egg" />
          <span className="price-chip chip-1">From ₹99<small>pack of 6</small></span>
          <span className="price-chip chip-2">₹499<small>tray of 30</small></span>
        </div>
      </div>
    </section>
  );
}
