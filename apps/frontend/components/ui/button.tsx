interface ButtonProps {
  children: React.ReactNode;

  type?: "button" | "submit";

  onClick?: () => void;
}

export default function Button({
  children,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}