import Chat from "@/components/ui/chat";
import ThemeSwitch from "@/components/ui/theme-switch";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex w-full flex-row justify-end">
        <ThemeSwitch />
      </div>
      <Chat />
    </main>
  );
}
