import { useRef } from "react"

export default function ThinkModal({open}) {
  const modal = useRef();


  return (
    <dialog ref={modal}>
      <p>Thinking</p>
    </dialog>
  )
}