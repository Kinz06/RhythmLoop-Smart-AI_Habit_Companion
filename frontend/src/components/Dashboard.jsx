import React, { useEffect, useState } from "react";
import API from "../api";
import StreakCalendar from "./StreakCalendar";
import { toast } from "react-toastify";

/**
 * Defensive dashboard:
 * - logs API results to console
 * - shows textual overview + calendar
 * - avoids calling things that may be objects
 */

const HABIT_CACHE_KEY = "shc_cached_habits";

function loadLocalHabits() {
  try {
    const raw = localStorage.getItem(HABIT_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed parsing local habits", e);
    return [];
  }
}

export default function Dashboard() {
  const [pred, setPred] = useState(null);
  const [habits, setHabits] = useState([]);
  const [activity, setActivity] = useState({ days: [], counts: [] });
  const [countsMap, setCountsMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    // show local cache immediately
    const local = loadLocalHabits();
    if (local && local.length) setHabits(local);

    try {
      console.log("Dashboard: calling /habits/");
      const h = await API.get("/habits/");
      console.log("/habits/ response:", h);

      if (h && h.data) {
        setHabits(h.data);
        localStorage.setItem(HABIT_CACHE_KEY, JSON.stringify(h.data));
      } else {
        console.warn("/habits/ returned unexpected shape:", h);
      }

      console.log("Dashboard: calling /analytics/predict?days=14");
      const p = await API.get("/analytics/predict?days=14");
      console.log("/analytics/predict response:", p);
      if (p && p.data) setPred(p.data);
      else console.warn("predict returned unexpected shape:", p);

      console.log("Dashboard: calling /analytics/activity?days=30");
      const a = await API.get("/analytics/activity?days=30");
      console.log("/analytics/activity response:", a);
      if (a && a.data) {
        setActivity(a.data);
        // build map for calendar
        const map = {};
        (a.data.days || []).forEach((d, i) => {
          map[d] = (a.data.counts && a.data.counts[i]) || 0;
        });
        setCountsMap(map);
      } else {
        console.warn("activity returned unexpected shape:", a);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Failed loading dashboard — showing cached data if available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Overview</h3>
        <div className="small">Habits (cached count): {habits.length}</div>
        <div style={{ marginTop: 8 }}>
          <strong>Model prediction (raw):</strong>
          <pre style={{ whiteSpace: "pre-wrap", maxHeight: 140, overflow: "auto", background:"#fafafa", padding:8 }}>
            {pred ? JSON.stringify(pred, null, 2) : "No prediction data"}
          </pre>
        </div>
      </div>

      <div className="card">
        <h3>Activity (last 30 days)</h3>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="small">Days returned: {activity.days ? activity.days.length : 0}</div>
            <pre style={{ whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background:"#fff", padding:8 }}>
              {activity && activity.days ? JSON.stringify(activity, null, 2) : "No activity data"}
            </pre>
          </div>

          <div style={{ width: 220 }}>
            <div className="small" style={{ marginBottom: 8 }}>
              Streak calendar (preview)
            </div>
            <StreakCalendar countsByDate={countsMap} days={30} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh dashboard"}
        </button>
      </div>
    </div>
  );
}
