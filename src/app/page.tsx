import { Header } from "./components/Header";
import { LanguageToggle } from "./components/LanguageToggle";

export default function Page() {
  return (
    <div className="min-h-dvh bg-surface">
      <Header>
        <LanguageToggle/>
      </Header>
    </div>
  );
}
