interface ButtonProps {
  children: React.ReactNode;

  type?: "button" | "submit";

  onClick?: () => void;

  disabled?: boolean;
}

export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
