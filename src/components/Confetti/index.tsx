import { useContext, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from '@mui/material';

/**
 * To customize confetti animation, debug and test animation on
 * https://www.kirilv.com/canvas-confetti/
 */
const showConfetti = (colours:string[]) => {
  const end = Date.now() + 600; // duration that confetti animation runs for
  (function frame() {
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 150,
      origin: { x: 0.5, y: 1 },
      colors: colours,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 200,
      origin: { x: 0.5, y: 0.6 },
      colors: colours,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

interface Props {
  show?: boolean;
}

const Confetti = ({ show = false }: Props) => {
  const theme = useTheme();
  const colours = [theme._figmaPaletteVariables.cardBg1, theme._figmaPaletteVariables.badgeTip];
  useEffect(() => {
    if (show) {
      showConfetti(colours);
    }
  }, [show]);
  return null;
};

export default Confetti;
