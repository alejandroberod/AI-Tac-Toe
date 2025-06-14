import ShinyText from "./ShinyText/ShinyText";

export default function ThinkModal({ ref }) {

  return (
    <dialog ref={ref} id="modal">
      <ShinyText text="Thinking" speed="1"/>
    </dialog>
  );
}
