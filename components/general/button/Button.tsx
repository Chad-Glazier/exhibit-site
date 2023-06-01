import deleteStyles from "./buttonStyles/delete.module.css";
import upStyles from "./buttonStyles/up.module.css";
import downStyles from "./buttonStyles/down.module.css";
import leftStyles from "./buttonStyles/left.module.css";
import rightStyles from "./buttonStyles/right.module.css";

const styleMap = new Map<string, string>();
styleMap.set("delete", deleteStyles.button);
styleMap.set("up", upStyles.button);
styleMap.set("down", downStyles.button);
styleMap.set("left", leftStyles.button);
styleMap.set("right", rightStyles.button);

export default function Button({ 
  style, 
  onClick, 
  className
}: { 
  style: "delete" | "up" | "down" | "left" | "right";
  onClick: () => void;
  className?: string;
}) {
  return <div 
    className={`${styleMap.get(style)} ${className ?? ""}`} 
    onClick={onClick}
  ></div>
}