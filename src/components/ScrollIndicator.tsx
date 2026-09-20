"use client";

import { motion } from "framer-motion";
import type { Ref } from "react";

/** Tiny vertical "01 / 06" counter; the digits roll to the active chapter and the hairline fills with overall progress. */
export function ScrollIndicator({ index, total, fillRef }: { index: number; total: number; fillRef: Ref<HTMLDivElement> }) {
  return (
    <div className="indicator mono" aria-hidden="true" data-indicator>
      <div className="count">
        <span className="digits">
          <motion.span className="digits-col" animate={{ y: `${-index * 1.6}em` }} transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8 }}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i}>{String(i + 1).padStart(2, "0")}</span>
            ))}
          </motion.span>
        </span>
        <span className="slash" />
        <span className="of">{String(total).padStart(2, "0")}</span>
      </div>
      <div className="track">
        <div className="fill" ref={fillRef} />
      </div>
    </div>
  );
}
