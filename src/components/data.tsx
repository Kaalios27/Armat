"use client";

import { useEffect, useState, type DependencyList } from "react";
import { useI18n } from "./i18n";
import { Button } from "./ui/primitives";

/** Load data from the local database for a page; reload() runs the loader again. */
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<{ data?: T; error?: unknown }>({});
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => !cancelled && setState({ data }),
      (error: unknown) => {
        console.error(error);
        if (!cancelled) setState({ error });
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { data: state.data, error: state.error, reload: () => setTick((x) => x + 1) };
}

export function PageLoading() {
  const { t } = useI18n();
  return <div className="pt-6 text-[15px] text-ink-3">{t("common.loading")}</div>;
}

export function PageError({ onRetry }: { onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-4 pt-6">
      <span className="text-[15px] text-caution">{t("common.error")}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
