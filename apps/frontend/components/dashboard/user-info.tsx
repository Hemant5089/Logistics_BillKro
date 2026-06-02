interface UserInfoProps {
  email: string;

  role: string;
}

export default function UserInfo({
  email,
  role,
}: UserInfoProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
      <p className="mb-3 text-lg">
        <span className="font-bold">
          Email:
        </span>{" "}
        {email}
      </p>

      <p className="text-lg">
        <span className="font-bold">
          Role:
        </span>{" "}
        {role}
      </p>
    </div>
  );
}