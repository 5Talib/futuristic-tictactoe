export default function InputFields({ label, placeholder,createRoom, field, setField }) {
  return (
    <>
      <label className="block text-white text-lg mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 mb-6 bg-black border border-teal-400 neon-input text-white outline-none rounded-md"
        value={field}
        disabled={createRoom && label === "Room Code"}
        onChange={(e) => setField(e.target.value)}
      />
    </>
  );
}
