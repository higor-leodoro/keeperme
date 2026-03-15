import { AuthCard } from "./_components/AuthCard";
import { GoogleAuthProvider } from "./_components/GoogleAuthProvider";

export default function LoginPage() {
  return (
    <GoogleAuthProvider>
      <div className="flex flex-col items-center justify-center dot-grid w-full h-dvh overflow-hidden px-4 sm:px-6">
        <AuthCard />
      </div>
    </GoogleAuthProvider>
  );
}
