import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from "chart.js";

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip);

const API = "http://127.0.0.1:8001";
const PALETTE = ["#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b"];
const DEMO_PORT = [
  { symbol: "AAPL", quantity: 80000 },
  { symbol: "MSFT", quantity: 78950 },
  { symbol: "NVDA", quantity: 100000 },
];
const EVT_DESC = {
  inflation: "A sustained inflation shock drives a −10% portfolio impact as rising rates compress equity valuations and increase borrowing costs.",
  crash: "A sharp market crash delivers a −20% immediate drawdown. Correlation across assets rises, reducing diversification benefits.",
  growth: "Bull-market conditions push equities up +10%. Growth and momentum assets outperform; cash-equivalent holdings lag.",
};
const BOT_ANSWERS = {
  risk: "Your portfolio has significant concentration in tech equities. The Sharpe ratio indicates returns may not be compensating for risk taken. Consider diversifying into bonds or defensive sectors.",
  crash: "A crash scenario shows a −20% immediate impact. Your highest-weight position would be hit hardest. A 10–15% allocation to gold or short-duration bonds could reduce max drawdown.",
  divers: "Your portfolio is concentrated in US large-cap tech. True diversification would include international equities, fixed income, and alternative assets.",
  sharpe: "Sharpe ratio measures return per unit of risk. Below 0 means you are losing money relative to a risk-free asset. Above 1 is generally considered good.",
  default: "Based on your current holdings, your portfolio is tech-heavy. Running the Analysis tab will give you precise Sharpe and VaR metrics.",
};

async function apiCall(path, method = "GET") {
  try {
    const res = await fetch(API + path, { method });
    return await res.json();
  } catch {
    return { error: "Cannot reach backend on port 8001" };
  }
}

// ─── Global styles injected once ─────────────────────────────────────────────

const CSS = `
.rw-shell{display:flex;min-height:100vh;background:#0e0e0e;color:#f0ede8;font-family:system-ui,-apple-system,sans-serif;font-size:14px}
.rw-sidebar{width:220px;flex-shrink:0;background:#161616;border-right:1px solid #2a2a2a;display:flex;flex-direction:column}
.rw-logo{padding:20px;border-bottom:1px solid #2a2a2a}
.rw-logo-name{font-size:18px;font-weight:700;color:#f0953a}
.rw-logo-sub{font-size:11px;color:#6b6762;margin-top:2px}
.rw-nav{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;color:#a8a49e;font-size:13px;border-left:3px solid transparent;transition:all .15s;user-select:none}
.rw-nav:hover{color:#f0ede8;background:#1e1e1e}
.rw-nav.on{color:#f0953a;background:rgba(240,149,58,.1);border-left-color:#f0953a;font-weight:500}
.rw-sb-foot{margin-top:auto;padding:16px 20px;border-top:1px solid #2a2a2a}
.rw-av-row{display:flex;align-items:center;gap:10px}
.rw-av{width:34px;height:34px;border-radius:50%;background:rgba(240,149,58,.12);border:1px solid #c97820;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#f0953a;flex-shrink:0}
.rw-uname{font-size:13px;font-weight:500}
.rw-ustatus{font-size:11px;color:#2dbc8e}
.rw-logout-btn{margin-left:auto;background:none;border:none;color:#6b6762;cursor:pointer;font-size:11px;padding:4px 6px;border-radius:4px}
.rw-logout-btn:hover{color:#e05555}
.rw-main{flex:1;padding:28px;overflow-y:auto;background:#0e0e0e}
.rw-pt{font-size:20px;font-weight:700;margin-bottom:4px}
.rw-ps{font-size:13px;color:#a8a49e;margin-bottom:24px}
.rw-card{background:#161616;border:1px solid #2a2a2a;border-radius:10px;padding:20px;margin-bottom:16px}
.rw-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.rw-ct{font-size:11px;font-weight:600;color:#a8a49e;text-transform:uppercase;letter-spacing:.06em}
.rw-sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:16px}
.rw-stat{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:8px;padding:14px}
.rw-sl{font-size:11px;color:#6b6762;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em}
.rw-sv{font-size:24px;font-weight:700}
.rw-ssub{font-size:11px;color:#6b6762;margin-top:4px}
.rw-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.rw-in{background:#1e1e1e;border:1px solid #333;color:#f0ede8;border-radius:7px;padding:0 12px;height:38px;font-size:13px;font-family:inherit;outline:none;transition:border .15s;flex:1;min-width:130px}
.rw-in:focus{border-color:#c97820}
.rw-in-sm{max-width:100px;flex:none}
.rw-sel{background:#1e1e1e;border:1px solid #333;color:#f0ede8;border-radius:7px;padding:0 12px;height:38px;font-size:13px;font-family:inherit;outline:none;cursor:pointer;flex:1}
.rw-sel:focus{border-color:#c97820}
.rw-btn{height:38px;padding:0 18px;border-radius:7px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.rw-btn:active{transform:scale(.97)}
.rw-btn.pri{background:#f0953a;color:#1a0d00}
.rw-btn.pri:hover{background:#e88820}
.rw-btn.pri:disabled{opacity:.6;cursor:not-allowed;transform:none}
.rw-btn.ghost{background:#1e1e1e;color:#a8a49e;border:1px solid #333}
.rw-btn.ghost:hover{color:#f0ede8;border-color:#444}
.rw-btn.sm{height:30px;padding:0 12px;font-size:12px}
.rw-ar{display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #2a2a2a;gap:10px}
.rw-ar:last-child{border-bottom:none}
.rw-tk{background:rgba(240,149,58,.1);color:#f0953a;font-weight:700;font-size:12px;padding:3px 10px;border-radius:5px;font-family:monospace;min-width:60px;text-align:center}
.rw-aq{color:#a8a49e;font-size:13px;flex:1}
.rw-apct{font-size:12px;color:#6b6762}
.rw-rm{background:none;border:none;color:#6b6762;cursor:pointer;font-size:18px;padding:0 6px;border-radius:4px;line-height:1}
.rw-rm:hover{color:#e05555;background:rgba(224,85,85,.12)}
.rw-ab{margin-bottom:10px}
.rw-abl{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}
.rw-abt{height:6px;background:#252525;border-radius:99px;overflow:hidden}
.rw-abf{height:100%;border-radius:99px;transition:width .6s ease}
.rw-br{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rw-brl{font-size:12px;color:#6b6762;width:24px;flex-shrink:0}
.rw-brt{flex:1;height:8px;background:#252525;border-radius:99px;overflow:hidden}
.rw-brf{height:100%;border-radius:99px;transition:width .5s ease}
.rw-brv{font-size:12px;font-weight:600;width:40px;text-align:right;flex-shrink:0}
.rw-notice{padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px}
.rw-ok{background:rgba(45,188,142,.12);color:#2dbc8e;border:1px solid rgba(45,188,142,.2)}
.rw-err{background:rgba(224,85,85,.12);color:#e05555;border:1px solid rgba(224,85,85,.2)}
.rw-empty{text-align:center;padding:32px;color:#6b6762;font-size:13px}
.rw-evtinfo{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:7px;padding:12px 14px;font-size:13px;color:#a8a49e;margin-bottom:16px;line-height:1.6}
.rw-chip{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;cursor:pointer;border:1px solid #333;color:#a8a49e;background:#1e1e1e;margin:0 6px 8px 0;transition:all .15s}
.rw-chip:hover{border-color:#c97820;color:#f0953a}
.rw-am{padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.6;margin-bottom:8px;max-width:90%}
.rw-au{background:rgba(240,149,58,.12);color:#f0ede8;border-bottom-right-radius:3px;margin-left:auto}
.rw-abot{background:#1e1e1e;border:1px solid #2a2a2a;color:#a8a49e;border-bottom-left-radius:3px}
.rw-tag{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600}
.rw-tok{background:rgba(45,188,142,.15);color:#2dbc8e}
.rw-tbad{background:rgba(224,85,85,.15);color:#e05555}
.rw-twarn{background:rgba(240,149,58,.15);color:#f0953a}
.rw-g{color:#2dbc8e}.rw-r{color:#e05555}.rw-o{color:#f0953a}
.rw-auth-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0e0e0e}
.rw-auth-card{background:#161616;border:1px solid #2a2a2a;border-radius:14px;padding:36px;width:100%;max-width:400px}
.rw-auth-logo{font-size:24px;font-weight:800;color:#f0953a;margin-bottom:4px}
.rw-auth-sub{font-size:13px;color:#6b6762;margin-bottom:28px}
.rw-atabs{display:flex;gap:6px;margin-bottom:20px}
.rw-atab{flex:1;padding:8px;border-radius:7px;border:1px solid #333;background:transparent;color:#a8a49e;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500;transition:all .15s}
.rw-atab.on{background:#f0953a;color:#1a0d00;border-color:transparent}
.rw-ain{width:100%;margin-bottom:10px}
.rw-ahint{font-size:12px;color:#6b6762;margin-top:12px;line-height:1.6}
.rw-mono{font-family:monospace;background:#1e1e1e;padding:1px 6px;border-radius:4px;color:#a8a49e}
.rw-spin{display:inline-block;width:13px;height:13px;border:2px solid rgba(26,13,0,.3);border-top-color:#1a0d00;border-radius:50%;animation:rws .65s linear infinite}
@keyframes rws{to{transform:rotate(360deg)}}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFlash() {
  const [notice, setNotice] = useState(null);
  function flash(msg, type = "ok") {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 4000);
  }
  const el = notice ? <div className={`rw-notice rw-${notice.type}`}>{notice.msg}</div> : null;
  return [el, flash];
}

function AllocBars({ portfolio }) {
  const total = portfolio.reduce((s, a) => s + a.quantity, 0);
  return (
    <>
      {portfolio.map((a, i) => {
        const pct = ((a.quantity / total) * 100).toFixed(1);
        return (
          <div key={a.symbol + i} className="rw-ab">
            <div className="rw-abl">
              <span style={{ fontWeight: 600, color: PALETTE[i % PALETTE.length] }}>{a.symbol}</span>
              <span style={{ color: "#6b6762" }}>{pct}%</span>
            </div>
            <div className="rw-abt">
              <div className="rw-abf" style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }} />
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [logU, setLogU] = useState("");
  const [logP, setLogP] = useState("");
  const [regU, setRegU] = useState("");
  const [regP, setRegP] = useState("");
  const [busy, setBusy] = useState(false);
  const [noticeEl, flash] = useFlash();

  async function doLogin() {
    if (!logU || !logP) { flash("Enter username and password", "err"); return; }
    setBusy(true);
    if (logU === "demo" && logP === "demo123") {
      await new Promise(r => setTimeout(r, 500));
      setBusy(false);
      onLogin("1", "demo-tok", "demo", true);
      return;
    }
    const d = await apiCall(`/login?username=${encodeURIComponent(logU)}&password=${encodeURIComponent(logP)}`, "POST");
    setBusy(false);
    if (d.error) { flash(d.error, "err"); return; }
    onLogin(String(d.user_id), d.token, logU, false);
  }

  async function doRegister() {
    if (!regU || !regP) { flash("Fill in all fields", "err"); return; }
    const d = await apiCall(`/register?username=${encodeURIComponent(regU)}&password=${encodeURIComponent(regP)}`, "POST");
    if (d.error) { flash(d.error, "err"); return; }
    flash("Account created — log in now");
    setTab("login"); setLogU(regU);
  }

  return (
    <div className="rw-auth-wrap">
      <div className="rw-auth-card">
        <div className="rw-auth-logo">RippleWealth</div>
        <div className="rw-auth-sub">AI-powered portfolio analysis &amp; simulation</div>
        {noticeEl}
        <div className="rw-atabs">
          <button className={`rw-atab${tab === "login" ? " on" : ""}`} onClick={() => setTab("login")}>Log in</button>
          <button className={`rw-atab${tab === "register" ? " on" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab === "login" ? (
          <>
            <input className="rw-in rw-ain" placeholder="Username" value={logU} onChange={e => setLogU(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
            <input className="rw-in rw-ain" type="password" placeholder="Password" value={logP} onChange={e => setLogP(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
            <button className="rw-btn pri" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={doLogin} disabled={busy}>
              {busy ? <><span className="rw-spin" /> Logging in…</> : "Log in"}
            </button>
            <div className="rw-ahint">Demo: <span className="rw-mono">demo</span> / <span className="rw-mono">demo123</span></div>
          </>
        ) : (
          <>
            <input className="rw-in rw-ain" placeholder="Username" value={regU} onChange={e => setRegU(e.target.value)} />
            <input className="rw-in rw-ain" type="password" placeholder="Password" value={regP} onChange={e => setRegP(e.target.value)} />
            <button className="rw-btn pri" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={doRegister}>Create account</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Portfolio Panel ──────────────────────────────────────────────────────────

function PortfolioPanel({ portfolio, onAdd, onRemove, onRefresh }) {
  const [sym, setSym] = useState("");
  const [qty, setQty] = useState("");
  const [busy, setBusy] = useState(false);
  const [noticeEl, flash] = useFlash();

  async function handleAdd() {
    const s = sym.trim().toUpperCase();
    const q = parseFloat(qty);
    if (!s) { flash("Enter a ticker symbol", "err"); return; }
    if (!q || q <= 0) { flash("Enter a valid quantity", "err"); return; }
    setBusy(true);
    await onAdd(s, q, flash);
    setSym(""); setQty(""); setBusy(false);
  }

  const total = portfolio.reduce((s, a) => s + a.quantity, 0);
  const top = portfolio.length ? portfolio.reduce((a, b) => b.quantity > a.quantity ? b : a) : null;

  return (
    <div>
      <div className="rw-pt">Portfolio</div>
      <div className="rw-ps">Manage your holdings</div>
      {noticeEl}
      <div className="rw-sg">
        <div className="rw-stat"><div className="rw-sl">Assets</div><div className="rw-sv rw-o">{portfolio.length}</div></div>
        <div className="rw-stat"><div className="rw-sl">Total shares</div><div className="rw-sv">{total.toLocaleString()}</div></div>
        <div className="rw-stat"><div className="rw-sl">Top holding</div><div className="rw-sv rw-o">{top ? top.symbol : "—"}</div></div>
      </div>
      <div className="rw-card">
        <div className="rw-ch"><span className="rw-ct">Add asset</span></div>
        <div className="rw-row">
          <input className="rw-in" placeholder="Ticker (e.g. NVDA)" value={sym} onChange={e => setSym(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <input className="rw-in rw-in-sm" type="number" placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <button className="rw-btn pri" onClick={handleAdd} disabled={busy}>
            {busy ? <span className="rw-spin" /> : "Add asset"}
          </button>
          <button className="rw-btn ghost" onClick={onRefresh}>Refresh</button>
        </div>
      </div>
      <div className="rw-card">
        <div className="rw-ch">
          <span className="rw-ct">Holdings</span>
          <span style={{ fontSize: 12, color: "#6b6762" }}>{portfolio.length} position{portfolio.length !== 1 ? "s" : ""}</span>
        </div>
        {portfolio.length === 0
          ? <div className="rw-empty">No holdings yet — add a ticker above</div>
          : portfolio.map((a, i) => (
            <div key={`${a.symbol}-${i}`} className="rw-ar">
              <span className="rw-tk">{a.symbol}</span>
              <span className="rw-aq">{Number(a.quantity).toLocaleString()} shares</span>
              <span className="rw-apct" style={{ color: PALETTE[i % PALETTE.length] }}>{((a.quantity / total) * 100).toFixed(1)}%</span>
              <button className="rw-rm" onClick={() => onRemove(i)}>×</button>
            </div>
          ))
        }
      </div>
      {portfolio.length > 0 && (
        <div className="rw-card">
          <div className="rw-ch"><span className="rw-ct">Allocation</span></div>
          <AllocBars portfolio={portfolio} />
        </div>
      )}
    </div>
  );
}

// ─── Analysis Panel ───────────────────────────────────────────────────────────

function AnalysisPanel({ portfolio, uid, isDemo }) {
  const [analysis, setAnalysis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [noticeEl, flash] = useFlash();

  async function run() {
    if (!portfolio.length) { flash("Add assets to your portfolio first", "err"); return; }
    setBusy(true);
    let d;
    if (isDemo) { await new Promise(r => setTimeout(r, 900)); d = { sharpe_ratio: -0.9820, VaR: -0.0209 }; }
    else { d = await apiCall(`/analyze?user_id=${uid}`); }
    setBusy(false);
    if (d.error) { flash(d.error, "err"); return; }
    setAnalysis(d);
  }

  const sr = analysis ? Number(analysis.sharpe_ratio) : null;
  const varV = analysis ? Number(analysis.VaR) : null;

  return (
    <div>
      <div className="rw-pt">Risk analysis</div>
      <div className="rw-ps">6-month return metrics from live market data</div>
      {noticeEl}
      <div className="rw-card">
        <div className="rw-ch"><span className="rw-ct">Run analysis</span></div>
        <div className="rw-row">
          <button className="rw-btn pri" onClick={run} disabled={busy}>
            {busy ? <><span className="rw-spin" /> Analyzing…</> : "Analyze portfolio"}
          </button>
          <span style={{ fontSize: 12, color: "#6b6762" }}>Fetches 6-month prices via yfinance</span>
        </div>
      </div>
      {analysis && (
        <>
          <div className="rw-sg">
            <div className="rw-stat">
              <div className="rw-sl">Sharpe ratio</div>
              <div className={`rw-sv ${sr > 1 ? "rw-g" : sr < 0 ? "rw-r" : "rw-o"}`}>{sr.toFixed(4)}</div>
              <div className="rw-ssub">
                <span className={`rw-tag ${sr > 1 ? "rw-tok" : sr < 0 ? "rw-tbad" : "rw-twarn"}`}>
                  {sr > 1 ? "Strong" : sr < 0 ? "Weak" : "Moderate"}
                </span>
              </div>
            </div>
            <div className="rw-stat">
              <div className="rw-sl">Value at risk (5%)</div>
              <div className={`rw-sv ${varV > -0.01 ? "rw-g" : "rw-r"}`}>{varV.toFixed(4)}</div>
              <div className="rw-ssub">Daily loss threshold</div>
            </div>
            {analysis.message && (
              <div className="rw-stat">
                <div className="rw-sl">Note</div>
                <div style={{ fontSize: 13, color: "#a8a49e", marginTop: 6 }}>{analysis.message}</div>
              </div>
            )}
          </div>
          {portfolio.length > 0 && (
            <div className="rw-card">
              <div className="rw-ch"><span className="rw-ct">Allocation breakdown</span></div>
              <AllocBars portfolio={portfolio} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Simulate Panel ───────────────────────────────────────────────────────────

function SimulatePanel({ uid, isDemo }) {
  const [event, setEvent] = useState("inflation");
  const [sim, setSim] = useState(null);
  const [busy, setBusy] = useState(false);
  const [noticeEl, flash] = useFlash();
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  async function run() {
    setBusy(true);
    let d;
    if (isDemo) {
      await new Promise(r => setTimeout(r, 700));
      const imp = { inflation: -10, crash: -20, growth: 10 }[event];
      d = { impact_percent: imp, projection: [0, 1, 2, 3, 4].map(i => parseFloat((100 * (1 + imp / 100 * i / 4)).toFixed(2))) };
    } else {
      d = await apiCall(`/simulate?event=${encodeURIComponent(event)}&user_id=${encodeURIComponent(uid)}`, "POST");
    }
    setBusy(false);
    if (d.error) { flash(d.error, "err"); return; }
    setSim(d);
  }

  useEffect(() => {
    if (!sim || !chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();
    const proj = Array.isArray(sim.projection) ? sim.projection : [];
    const pos = sim.impact_percent >= 0;
    chartInst.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: proj.map((_, i) => `T${i}`),
        datasets: [{ data: proj.map(v => Number(v).toFixed(2)), borderColor: pos ? "#2dbc8e" : "#e05555", backgroundColor: pos ? "rgba(45,188,142,.08)" : "rgba(224,85,85,.08)", borderWidth: 2, pointRadius: 5, pointBackgroundColor: pos ? "#2dbc8e" : "#e05555", fill: true, tension: 0.35 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { color: "#6b6762", font: { size: 11 } } },
          y: { grid: { color: "rgba(255,255,255,.05)" }, ticks: { color: "#6b6762", font: { size: 11 } } },
        },
      },
    });
  }, [sim]);

  const imp = sim ? Number(sim.impact_percent) : null;
  const pos = imp !== null && imp >= 0;
  const proj = sim && Array.isArray(sim.projection) ? sim.projection : [];
  const base = proj[0] || 100;
  const fin = proj.length ? proj[proj.length - 1] : null;

  return (
    <div>
      <div className="rw-pt">Event simulation</div>
      <div className="rw-ps">See how macro events affect your portfolio</div>
      {noticeEl}
      <div className="rw-card">
        <div className="rw-ch"><span className="rw-ct">Select event</span></div>
        <div className="rw-row" style={{ marginBottom: 14 }}>
          <select className="rw-sel" value={event} onChange={e => setEvent(e.target.value)}>
            <option value="inflation">Inflation shock</option>
            <option value="crash">Market crash</option>
            <option value="growth">Bull growth</option>
          </select>
          <button className="rw-btn pri" onClick={run} disabled={busy}>
            {busy ? <><span className="rw-spin" /> Running…</> : "Run simulation"}
          </button>
        </div>
        <div className="rw-evtinfo">{EVT_DESC[event]}</div>
      </div>
      {sim && (
        <>
          <div className="rw-sg">
            <div className="rw-stat"><div className="rw-sl">Impact</div><div className={`rw-sv ${pos ? "rw-g" : "rw-r"}`}>{pos ? "+" : ""}{imp.toFixed(1)}%</div></div>
            <div className="rw-stat"><div className="rw-sl">Base value</div><div className="rw-sv rw-o">100</div></div>
            <div className="rw-stat"><div className="rw-sl">Final value</div><div className={`rw-sv ${fin >= 100 ? "rw-g" : "rw-r"}`}>{fin !== null ? Number(fin).toFixed(1) : "—"}</div></div>
          </div>
          <div className="rw-card">
            <div className="rw-ch"><span className="rw-ct">5-step projection</span></div>
            <div style={{ marginBottom: 16 }}>
              {proj.map((v, i) => {
                const pct = ((v - base) / base) * 100;
                const w = Math.min(Math.abs(pct) * 5 + 15, 100);
                return (
                  <div key={i} className="rw-br">
                    <div className="rw-brl">T{i}</div>
                    <div className="rw-brt"><div className="rw-brf" style={{ width: `${w}%`, background: pct >= 0 ? "#2dbc8e" : "#e05555" }} /></div>
                    <div className="rw-brv" style={{ color: pct >= 0 ? "#2dbc8e" : "#e05555" }}>{Number(v).toFixed(1)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: 180, position: "relative" }}>
              <canvas ref={chartRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Agent Panel ──────────────────────────────────────────────────────────────

function AgentPanel({ uid, isDemo }) {
  const [query, setQuery] = useState("");
  const [thread, setThread] = useState([]);
  const [busy, setBusy] = useState(false);
  const threadRef = useRef(null);

  const CHIPS = ["What is my portfolio risk?", "Should I worry about a market crash?", "Is my portfolio well diversified?", "What is my Sharpe ratio telling me?"];

  async function ask() {
    const q = query.trim();
    if (!q) return;
    setThread(t => [...t, { role: "user", text: q }]);
    setQuery(""); setBusy(true);
    let resp;
    if (isDemo) {
      await new Promise(r => setTimeout(r, 800));
      const ql = q.toLowerCase();
      if (ql.includes("risk")) resp = BOT_ANSWERS.risk;
      else if (ql.includes("crash")) resp = BOT_ANSWERS.crash;
      else if (ql.includes("divers")) resp = BOT_ANSWERS.divers;
      else if (ql.includes("sharpe")) resp = BOT_ANSWERS.sharpe;
      else resp = BOT_ANSWERS.default;
    } else {
      const d = await apiCall(`/agent?query=${encodeURIComponent(q)}`, "POST");
      resp = d.response || d.error || "No response";
    }
    setBusy(false);
    setThread(t => [...t, { role: "bot", text: resp }]);
  }

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [thread, busy]);

  return (
    <div>
      <div className="rw-pt">AI Agent</div>
      <div className="rw-ps">Ask anything about your portfolio</div>
      <div style={{ marginBottom: 12 }}>
        {CHIPS.map(c => <span key={c} className="rw-chip" onClick={() => setQuery(c)}>{c}</span>)}
      </div>
      <div ref={threadRef} style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
        {thread.length === 0 && <div className="rw-empty">Ask a question using the chips above or type below.</div>}
        {thread.map((m, i) => (
          <div key={i} className={`rw-am ${m.role === "user" ? "rw-au" : "rw-abot"}`}>{m.text}</div>
        ))}
        {busy && <div className="rw-am rw-abot" style={{ color: "#6b6762" }}><span className="rw-spin" style={{ borderTopColor: "#6b6762" }} /> Thinking…</div>}
      </div>
      <div className="rw-card" style={{ marginBottom: 0 }}>
        <div className="rw-row">
          <input className="rw-in" placeholder="Ask about your portfolio…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()} />
          <button className="rw-btn pri" onClick={ask} disabled={busy}>Ask</button>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "portfolio", label: "Portfolio", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg> },
  { id: "analysis", label: "Analysis", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1,12 5,7 8,9 11,4 15,6"/><line x1="1" y1="15" x2="15" y2="15"/></svg> },
  { id: "simulate", label: "Simulate", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><polyline points="8,4 8,8 11,10"/></svg> },
  { id: "agent", label: "AI Agent", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 2V4a1 1 0 0 1 1-1z"/></svg> },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("portfolio");
  const [portfolio, setPortfolio] = useState([]);

  async function loadPortfolio(uid, isDemo) {
    const id = uid ?? user?.uid;
    const demo = isDemo ?? user?.isDemo;
    if (demo) { setPortfolio([...DEMO_PORT]); return; }
    const d = await apiCall(`/portfolio?user_id=${id}`);
    if (Array.isArray(d)) setPortfolio(d);
  }

  function handleLogin(uid, tok, username, isDemo) {
    setUser({ uid, tok, username, isDemo });
    loadPortfolio(uid, isDemo);
  }

  async function handleAdd(sym, qty, flash) {
    if (user?.isDemo) { setPortfolio(p => [...p, { symbol: sym, quantity: qty }]); flash(`${sym} added`); return; }
    const d = await apiCall(`/portfolio/add?symbol=${encodeURIComponent(sym)}&quantity=${encodeURIComponent(qty)}&user_id=${encodeURIComponent(user.uid)}`, "POST");
    if (d.error) { flash(d.error, "err"); return; }
    flash(`${sym} added`);
    loadPortfolio();
  }

  if (!user) return <><style>{CSS}</style><AuthScreen onLogin={handleLogin} /></>;

  return (
    <>
      <style>{CSS}</style>
      <div className="rw-shell">
        <aside className="rw-sidebar">
          <div className="rw-logo">
            <div className="rw-logo-name">RippleWealth</div>
            <div className="rw-logo-sub">Portfolio Intelligence</div>
          </div>
          {TABS.map(t => (
            <div key={t.id} className={`rw-nav${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon}{t.label}
            </div>
          ))}
          <div className="rw-sb-foot">
            <div className="rw-av-row">
              <div className="rw-av">{user.username.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="rw-uname">{user.username}</div>
                <div className="rw-ustatus">● Authenticated</div>
              </div>
              <button className="rw-logout-btn" onClick={() => { setUser(null); setPortfolio([]); }}>Out</button>
            </div>
          </div>
        </aside>
        <main className="rw-main">
          {tab === "portfolio" && <PortfolioPanel portfolio={portfolio} onAdd={handleAdd} onRemove={i => setPortfolio(p => p.filter((_, idx) => idx !== i))} onRefresh={loadPortfolio} />}
          {tab === "analysis" && <AnalysisPanel portfolio={portfolio} uid={user.uid} isDemo={user.isDemo} />}
          {tab === "simulate" && <SimulatePanel uid={user.uid} isDemo={user.isDemo} />}
          {tab === "agent" && <AgentPanel uid={user.uid} isDemo={user.isDemo} />}
        </main>
      </div>
    </>
  );
}
