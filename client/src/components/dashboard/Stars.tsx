interface Props {
  level: number;
}

export default function Stars({ level }: Props) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: level }).map((_, i) => (
        <span key={i}>⭐</span>
      ))}
    </div>
  );
}