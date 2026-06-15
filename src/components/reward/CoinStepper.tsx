/**
 * Coin Stepper — a +/- picker for coin values.
 * Ported from study-plan-app's CoinStepper.vue.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";

interface CoinStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}

export default function CoinStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  hint,
}: CoinStepperProps) {
  const safeValue = Math.max(min, Math.min(max, value));

  useEffect(() => {
    // Keep value in bounds if props change
    if (safeValue !== value) {
      onChange(safeValue);
    }
  }, [safeValue, onChange, value]);

  const decrement = () => onChange(Math.max(min, safeValue - 1));
  const increment = () => onChange(Math.min(max, safeValue + 1));

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={hint || "金币选择"}>
      <motion.button
        type="button"
        onClick={decrement}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full text-white font-extrabold text-xl grid place-items-center cursor-pointer transition-all border-2"
        style={{
          background: "linear-gradient(135deg, #fb7185, #f43f5e)",
          boxShadow: "0 5px 0 #be123c",
        }}
        aria-label="减少"
      >
        −
      </motion.button>

      <div
        className="w-16 h-11 rounded-full grid place-items-center font-extrabold text-lg"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          color: "#92400e",
          border: "3px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "inset 0 -3px 0 rgba(245, 158, 11, 0.15)",
        }}
      >
        {safeValue}
      </div>

      <motion.button
        type="button"
        onClick={increment}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full text-white font-extrabold text-xl grid place-items-center cursor-pointer transition-all border-2"
        style={{
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          boxShadow: "0 5px 0 #15803d",
        }}
        aria-label="增加"
      >
        +
      </motion.button>
    </div>
  );
}
