/**
 * Draws the pack size as a mini egg-carton — six eggs per row,
 * so a 30-pack reads instantly as a five-row tray.
 */
export default function CartonDiagram({ packSize, category }) {
  return (
    <div className="carton" aria-label={`Pack of ${packSize} eggs`}>
      {Array.from({ length: packSize }, (_, i) => (
        <span key={i} className={`carton-egg ${category}`} />
      ))}
    </div>
  );
}
