import { SettingsForm } from "@/components/settings-form";
import { PageTitle } from "@/components/ui/primitives";
import { translator } from "@/lib/i18n/messages";
import { aiConfig } from "@/server/ai/config";
import { currentSpend } from "@/server/ai/provider";
import { authMode } from "@/server/auth";
import { database, databaseKind } from "@/server/db/client";
import { tzHint } from "@/server/http";
import { getProfile } from "@/server/services/profile";
import { ttsDescription } from "@/server/tts";

export default async function SettingsPage() {
  const profile = await getProfile(await tzHint());
  const t = translator(profile.uiLang);
  const cfg = aiConfig();
  const spend = await currentSpend(await database());
  return (
    <div className="enter">
      <PageTitle>{t("settings.title")}</PageTitle>
      <SettingsForm
        uiLang={profile.uiLang}
        theme={profile.theme}
        timezoneSetting={profile.timezoneSetting}
        timezone={profile.timezone}
        pace={profile.pace}
        newWordsTarget={profile.newWordsTarget}
        dictationVoice={profile.dictationVoice}
        ttsServer={ttsDescription()}
        ai={{
          provider: cfg.provider,
          model: cfg.model,
          configured: cfg.configured,
          spendDay: spend.day,
          spendMonth: spend.month,
          dailyBudget: cfg.dailyBudgetUsd,
          monthlyBudget: cfg.monthlyBudgetUsd,
          perMinute: cfg.maxCallsPerMinute,
        }}
        database={databaseKind()}
        authEnabled={authMode() === "enabled"}
      />
    </div>
  );
}
