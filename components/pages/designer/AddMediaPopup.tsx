import styles from "./AddMediaPopup.module.css";
import { Popup } from "@/components/general";

export default function AddMediaPopup({
  show,
  onClickAway
}: {
  show?: boolean,
  onClickAway?: () => void
}) {
  return (
    <Popup
      show={show}
      onClickAway={onClickAway}
    >
      <form>
        
      </form>
    </Popup>
  )
}