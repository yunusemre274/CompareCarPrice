import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@/lib/i18n";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const activeCode = (i18n.language || "en").split("-")[0];
  const activeLanguage = supportedLanguages.find((lang) => lang.code === activeCode) ?? supportedLanguages[0];

  const handleLanguageChange = (code: string) => {
    if (code !== activeCode) {
      i18n.changeLanguage(code);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[170px] justify-between"
          aria-label={t("languageSelector.label")}
        >
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="truncate">{activeLanguage.nativeName}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>{t("languageSelector.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((language) => {
          const isActive = language.code === activeCode;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <div>
                <p className="font-medium">{language.nativeName}</p>
                <p className="text-xs text-muted-foreground">{language.label}</p>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
