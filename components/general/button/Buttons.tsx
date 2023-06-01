import styles from "./Buttons.module.css";
import Button from "./Button";

/**
 * Creates a set of buttons to match the handler props you provide. E.g.,
 * including the `onDelete` prop will add a delete button.
 * 
 * @returns ```tsx
 *  <div className={className}>
 *    ...
 *  </div>
 * ``` 
 */
export default function Buttons({
  className,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  horizontal
}: {
  className?: string;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  horizontal?: boolean;
}) {
  return (
    <div 
      className={styles.buttons + " " + (className ?? "")}
      style={{
        flexDirection: horizontal ? "row" : "column"
      }}
    >
      {onDelete && 
        <Button
          className={styles.button}
          style="delete"
          onClick={onDelete}
        />
      }
      {onMoveUp && 
        <Button
          className={styles.button}
          style="up"
          onClick={onMoveUp}
        />
      }
      {onMoveDown && 
        <Button
          className={styles.button}
          style="down"
          onClick={onMoveDown}
        />
      }
      {onMoveLeft &&
        <Button
          className={styles.button}
          style="left"
          onClick={onMoveLeft}
        />
      }
      {onMoveRight &&
        <Button
          className={styles.button}
          style="right"
          onClick={onMoveRight}
        />
      }
    </div>
  );
}