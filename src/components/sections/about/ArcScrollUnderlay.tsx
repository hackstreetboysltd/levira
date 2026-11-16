/**
 * Full-track backdrop that scrolls with the document (not sticky).
 * WASH field stills show through atmosphere slits so mid-band scroll is readable.
 * Photo: school handwashing station, Rwanda (Wikimedia Commons, CC BY-SA 4.0).
 */
export function ArcScrollUnderlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-deep" />

      <div className="absolute inset-0 flex flex-col">
        {[0, 1, 2].map((band) => (
          <div
            key={band}
            className="min-h-0 flex-1 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/wash-field-dummy.jpg')",
            }}
          />
        ))}
      </div>

    </div>
  );
}
