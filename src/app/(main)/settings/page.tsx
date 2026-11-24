"use client";

import { useI18n } from "@/components/i18n";
import { SettingsForm } from "@/components/settings-form";
import { PageTitle } from "@/components/ui/primitives";

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div className="enter flex flex-col gap-10">
      <PageTitle>{t("settings.title")}</PageTitle>
      <SettingsForm />
    </div>
  );
}
