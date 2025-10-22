export default function ModelSelector({ models, selected, onChange }: any) {
  return (
    <select
      className="border p-2 rounded-md"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      {models.map((m: any) => (
        <option key={m.tag} value={m.tag}>
          {m.tag}
        </option>
      ))}
    </select>
  );
}
