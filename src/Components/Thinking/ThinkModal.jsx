import Spinner from "./spinner/Spinner";

export default function ThinkModal({ ref }) {

  return (
    <dialog ref={ref} id="modal">
      <Spinner />
    </dialog>
  );
}
