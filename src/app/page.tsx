import { Header } from "./components/Header";
import { Icon } from "./components/Icon";
import { LanguageToggle } from "./components/LanguageToggle";

export default function Page() {
  return (
    <div className="min-h-dvh bg-surface">
      <Header>
        <LanguageToggle/>
        <Icon size='l' icon="Bell"/>
      </Header>
    </div>
  );
}
