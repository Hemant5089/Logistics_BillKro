interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <button
        onClick={onLogout}
        className="bg-black text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}