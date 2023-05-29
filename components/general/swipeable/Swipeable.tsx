import styles from "./Swipeable.module.css";
import { ReactNode, useRef } from "react";

/**
 * Creates a container that can be swiped in any direction to trigger a callback.
 * 
 * @returns 
 * ```tsx
 *  <div className={className} ...>
 *    {...children}
 *  </div>
 * ```
 * 
 * @example
 * Let `pages` be some array of `JSX.Element`s. The following code will create a container
 * that can be swiped left or right to change the current page.
 * 
 * ```tsx
 * const [currentPageIndex, setCurrentPageIndex] = useState(0);
 * 
 * <Swipeable
 *   onSwipeLeft={() => 
 *     setCurrentPageIndex(prev => (prev + 1) % pages.length)
 *   }
 *   onSwipeRight={() => 
 *     setCurrentPageIndex(prev => prev ? prev - 1 : pages.length - 1)
 *   }
 * >
 *   {pages.map((page, index) => (
 *     <section key={index}>
 *       {page}
 *     </section>   
 *   )}
 * </Swipeable>
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
   * @param displacement the magnitude of the swipe in pixels.
   * @param originalVector the vector of the swipe, with the origin at the start of the 
   * swipe. the `originalVector.x` represents the horizontal displacement (positive for
   * right, negative for left) and `originalVector.y` represents the vertical displacement
   * (positive for down, negative for up).
   */
  onSwipe?: (
    angleInRadians: number, 
    displacement: number, 
    originalVector: { x: number, y: number}
  ) => void;
  /**
   * the number of pixels the user must swipe to trigger a callback, defaults to 70.
   */ 
  minSwipeDistance?: number;
  className?: string;
}) {
  const initialX = useRef(0);
  const initialY = useRef(0);
  const defaultMinSwipeDistance = 70;

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
        onSwipe?.(angle, magnitude, {
          x: horizontalDisplacement,
          y: verticalDisplacement
        });

        initialX.current = 0;
        initialY.current = 0;
      }}
    >
      {children}
    </div>
  );
}