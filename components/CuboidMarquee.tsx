'use client';

export default function CuboidMarquee() {
  const marqueeText = "SEE C8C WORK • AWARD-WINNING CREATIVE STUDIO • HIGH IMPACT DIGITAL CRAFT • WE BREAK THE RULES • JOIN CRE8TIVECOVE •";

  return (
    <div className="w-full py-12 bg-black overflow-hidden perspective-container">
      <div className="cuboid-marquee-wrapper">
        {/* Face 1 */}
        <div className="cuboid-face cuboid-face-1">
          <div className="whitespace-nowrap flex gap-8 items-center">
            <span className="text-2xl sm:text-4xl font-black uppercase text-[var(--gold)] tracking-widest font-['Syne']">
              {marqueeText}
            </span>
            <span className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest font-['Syne']">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Face 2 */}
        <div className="cuboid-face cuboid-face-2">
          <div className="whitespace-nowrap flex gap-8 items-center">
            <span className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest font-['Syne']">
              {marqueeText}
            </span>
            <span className="text-2xl sm:text-4xl font-black uppercase text-[var(--gold)] tracking-widest font-['Syne']">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Face 3 */}
        <div className="cuboid-face cuboid-face-3">
          <div className="whitespace-nowrap flex gap-8 items-center">
            <span className="text-2xl sm:text-4xl font-black uppercase text-[var(--gold)] tracking-widest font-['Syne']">
              {marqueeText}
            </span>
            <span className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest font-['Syne']">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Face 4 */}
        <div className="cuboid-face cuboid-face-4">
          <div className="whitespace-nowrap flex gap-8 items-center">
            <span className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest font-['Syne']">
              {marqueeText}
            </span>
            <span className="text-2xl sm:text-4xl font-black uppercase text-[var(--gold)] tracking-widest font-['Syne']">
              {marqueeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
