import styles from "./Swipeable.module.css";
import { ReactNode, useRef } from "react";

/**
 * Creates a container that can be swiped left or right.
 * 
 * @param children The elements to be wrapped and swipeable.
 * @param onSwipeLeft A callback to be called when the user swipes left.
 * @param onSwipeRight A callback to be called when the user swipes right.
 * @param minSwipeDistance The minimum distance the user must swipe to trigger a callback.
 * @param className a className to be applied to the container.
 * @returns 
 * ```tsx
 *  <div className={className} ...>
 *    {...children}
 *  </div>
 * ```
 */
export default function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onSwipe,
  minSwipeDistance,
  className
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  /**
   * @param angleInRadians the angle of the swipe in radians: 
   * | Degrees | Direction | Radians            |
   * |---------|-----------|--------------------|
   * | 0       | Right     | `0`                |
   * | 90      | Up        | `Math.PI / 2`      |
   * | 180     | Left      | `Math.PI`          |
   * | 270     | Down      | `Math.PI * 3 / 2`  |
   * @param displacement the magnitude of the swipe; how many pixels the swipe covered.
   */
  onSwipe?: (angleInRadians: number, displacement: number) => void;
  /**
   * the number of pixels the user must swipe to trigger a callback, defaults to 100.
   */ 
  minSwipeDistance?: number;
  className?: string;
}) {
  const initialX = useRef(0);
  const initialY = useRef(0);
  const defaultMinSwipeDistance = 100;

  return (
    <div 
      className={className + " " + styles.main}
      onTouchStart={e => {
        initialX.current = e.touches[0].clientX;
        initialY.current = e.touches[0].clientY;
      }}
      onTouchEnd={e => {
        const finalX = e.changedTouches[0].clientX;
        const finalY = e.changedTouches[0].clientY;
        const horizontalDisplacement = finalX - initialX.current;
        const verticalDisplacement = finalY - initialY.current;

        if (horizontalDisplacement > (minSwipeDistance ?? defaultMinSwipeDistance)) {
          onSwipeRight?.();
        }

        if (-horizontalDisplacement > (minSwipeDistance ?? defaultMinSwipeDistance)) {
          onSwipeLeft?.();
        }

        if (verticalDisplacement > (minSwipeDistance ?? defaultMinSwipeDistance)) {
          onSwipeUp?.();
        }

        if (-verticalDisplacement > (minSwipeDistance ?? defaultMinSwipeDistance)) {
          onSwipeDown?.();
        }

        let angle = Math.atan2(verticalDisplacement, horizontalDisplacement);
        if (angle < 0) angle += Math.PI * 2;
        const magnitude = Math.sqrt(horizontalDisplacement ** 2 + verticalDisplacement ** 2);
        onSwipe?.(angle, magnitude);

        initialX.current = 0;
        initialY.current = 0;
      }}
    >
      {children}
    </div>
  );
}