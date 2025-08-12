import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const useCountUp = (value: number, duration = 800) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value < 1) return;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, duration]);
  return value < 1 ? 0 : count;
};

const KeyMetricsStrip: React.FC = () => {
  const [stats, setStats] = useState<{
    total_recruiters: number | null;
    avg_time_to_hire: number | null;
    total_placements: number | null;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("public_site_stats")
      .select("total_recruiters, avg_time_to_hire, total_placements")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.warn("public_site_stats error", error.message);
          setStats(null);
          return;
        }
        setStats(data as any);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const allNull = useMemo(() => {
    if (!stats) return true;
    const { total_recruiters, avg_time_to_hire, total_placements } = stats;
    return (
      total_recruiters == null && avg_time_to_hire == null && total_placements == null
    );
  }, [stats]);

  if (!stats || allNull) return null;

  const tr = stats.total_recruiters ?? 0;
  const ath = stats.avg_time_to_hire ?? 0;
  const tp = stats.total_placements ?? 0;

  const cTr = useCountUp(tr);
  const cAth = useCountUp(Math.round(ath));
  const cTp = useCountUp(tp);

  return (
    <section aria-label="Numeri chiave" className="py-10 border-t border-gray-200 bg-gray-50/60">
      <div className="container-startup">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {tr >= 1 && (
            <div className="rounded-2xl p-6 bg-white shadow-startup">
              <p className="text-3xl font-bold text-navy">{cTr.toLocaleString()}</p>
              <p className="text-muted-foreground">Recruiter nella rete</p>
            </div>
          )}
          {ath >= 1 && (
            <div className="rounded-2xl p-6 bg-white shadow-startup">
              <p className="text-3xl font-bold text-navy">{cAth}</p>
              <p className="text-muted-foreground">Giorni medi per assumere</p>
            </div>
          )}
          {tp >= 1 && (
            <div className="rounded-2xl p-6 bg-white shadow-startup">
              <p className="text-3xl font-bold text-navy">{cTp.toLocaleString()}</p>
              <p className="text-muted-foreground">Assunzioni concluse</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeyMetricsStrip;
