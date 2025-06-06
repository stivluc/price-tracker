interface StatusBannerProps {
  value: number; // percentage
  threshold?: number; // default 50
}

export function StatusBanner({ value, threshold = 50 }: StatusBannerProps) {
  let color = "bg-green-500";
  let label = "\u{1F7E2} OK"; // 🟢
  if (value > threshold) {
    color = "bg-red-500";
    label = "\u{1F534} Critique"; // 🔴
  } else if (value > threshold / 2) {
    color = "bg-yellow-400";
    label = "\u{1F7E0} Alerte"; // 🟠
  }

  return (
    <div className={`${color} text-white text-center rounded-md p-4 font-bold`}>
      {label}
    </div>
  );
}
