import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CloudRain,
  Gauge,
  Landmark,
  MapPinned,
  Menu,
  Radar,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Waves,
  Wind
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { Link, Route, Routes } from 'react-router-dom'

const monitoringStats = [
  { label: 'Active Monitoring Zones', value: 128, trend: '+6.2%', icon: Radar },
  { label: 'High Risk Zones', value: 23, trend: '+2.8%', icon: ShieldAlert },
  { label: 'Active Alerts', value: 7, trend: '-1.2%', icon: Bell },
  { label: 'Rainfall Stations', value: 64, trend: '+9.4%', icon: CloudRain },
  { label: 'Sensors Online', value: 342, trend: '+4.1%', icon: Gauge }
]

const stateRiskData = [
  { name: 'Assam', risk: 78, rainfall: 128, alerts: 3 },
  { name: 'Arunachal', risk: 82, rainfall: 142, alerts: 2 },
  { name: 'Meghalaya', risk: 74, rainfall: 119, alerts: 4 },
  { name: 'Nagaland', risk: 68, rainfall: 96, alerts: 2 },
  { name: 'Mizoram', risk: 72, rainfall: 110, alerts: 2 },
  { name: 'Tripura', risk: 60, rainfall: 88, alerts: 1 },
  { name: 'Sikkim', risk: 77, rainfall: 136, alerts: 3 }
]

const alertFeed = [
  { id: 1, zone: 'Cherrapunji Slopes', severity: 'Critical', time: '2 min ago', detail: 'Slope movement +2.8 mm detected', status: 'Escalated' },
  { id: 2, zone: 'Kohima Ridge', severity: 'High', time: '12 min ago', detail: 'Rainfall anomaly and soil stress rising', status: 'Watch' },
  { id: 3, zone: 'Itanagar Corridor', severity: 'Moderate', time: '27 min ago', detail: 'Groundwater saturation above threshold', status: 'Monitoring' },
  { id: 4, zone: 'Aizawl Hills', severity: 'High', time: '41 min ago', detail: 'Road cut instability flagged by model', status: 'Watch' }
]

const trendData = [
  { month: 'Jan', risk: 42, rain: 48 },
  { month: 'Feb', risk: 46, rain: 52 },
  { month: 'Mar', risk: 54, rain: 58 },
  { month: 'Apr', risk: 61, rain: 68 },
  { month: 'May', risk: 66, rain: 76 },
  { month: 'Jun', risk: 78, rain: 89 },
  { month: 'Jul', risk: 84, rain: 96 },
  { month: 'Aug', risk: 88, rain: 102 },
  { month: 'Sep', risk: 81, rain: 94 }
]

const incidentData = [
  { name: 'Low', value: 22, color: '#10b981' },
  { name: 'Moderate', value: 31, color: '#fbbf24' },
  { name: 'High', value: 27, color: '#f97316' },
  { name: 'Critical', value: 20, color: '#ef4444' }
]

const locations = [
  { name: 'Mawsynram Hill', region: 'Meghalaya', risk: 'Critical', score: 91, status: 'Evacuation watch' },
  { name: 'Khirbari Ridge', region: 'Assam', risk: 'High', score: 82, status: 'Monitoring' },
  { name: 'Noney Valley', region: 'Manipur', risk: 'High', score: 80, status: 'Field team deployed' },
  { name: 'Tawang Slope', region: 'Arunachal', risk: 'Moderate', score: 63, status: 'Sensor watch' }
]

const mapMarkers = [
  { name: 'Cherrapunji Slopes', position: [25.3, 91.73] as [number, number], risk: 'Critical' },
  { name: 'Aizawl Hills', position: [23.73, 92.72] as [number, number], risk: 'High' },
  { name: 'Shillong Roadcut', position: [25.57, 91.88] as [number, number], risk: 'Moderate' },
  { name: 'Kohima Ridge', position: [25.67, 94.11] as [number, number], risk: 'High' },
  { name: 'Itanagar Corridor', position: [27.1, 93.62] as [number, number], risk: 'Moderate' }
]

function getRiskColor(score: number) {
  if (score < 26) return '#10b981'
  if (score < 51) return '#fbbf24'
  if (score < 76) return '#f97316'
  return '#ef4444'
}

function markerColor(risk: string) {
  if (risk === 'Critical') return '#ef4444'
  if (risk === 'High') return '#f97316'
  if (risk === 'Moderate') return '#fbbf24'
  return '#10b981'
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">LandslideGuard AI</div>
            <div className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">AI-Powered Early Warning & Risk Monitoring</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/dashboard" className="hover:text-white">Live Monitoring</Link>
          <Link to="/risk-map" className="hover:text-white">Risk Map</Link>
          <Link to="/analytics" className="hover:text-white">Analytics</Link>
          <Link to="/alerts" className="hover:text-white">Alerts</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm text-slate-200 md:inline-flex">
            Open Dashboard
          </button>
          <button className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-2 md:hidden">
            <Menu className="h-5 w-5 text-slate-200" />
          </button>
        </div>
      </div>
    </header>
  )
}

function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(103,232,249,0.12),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-20">
        <div className="topo-pattern h-full w-full" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <section className="grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs tracking-[0.18em] text-cyan-200 uppercase">
              <Radar className="h-3.5 w-3.5" />
              AI Monitoring System
            </div>

            <div className="space-y-5">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Predict. Prepare. Protect.
              </h1>
              <p className="max-w-lg text-lg text-slate-300">
                AI-powered landslide risk monitoring and early warning for the North Eastern Region of India.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300">
                Explore Live Monitoring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/risk-map" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-6 py-3 font-semibold text-white transition hover:border-slate-500 hover:bg-slate-700/70">
                View Risk Map
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-xs text-slate-400">AI Risk Score</div>
                <div className="mt-2 text-2xl font-bold text-cyan-300">87%</div>
                <div className="mt-1 text-[10px] tracking-[0.14em] text-red-300 uppercase">High Risk</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-xs text-slate-400">Rainfall</div>
                <div className="mt-2 text-2xl font-bold text-amber-300">124 mm</div>
                <div className="mt-1 text-[10px] tracking-[0.14em] text-slate-400 uppercase">Last 24H</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-xs text-slate-400">Ground Movement</div>
                <div className="mt-2 text-2xl font-bold text-rose-300">+2.8 mm</div>
                <div className="mt-1 text-[10px] tracking-[0.14em] text-slate-400 uppercase">Increasing</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/80 p-4 shadow-[0_0_60px_rgba(14,165,233,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_50%)]" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-700 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Regional Terrain Monitor</div>
                  <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-200">Live</div>
                </div>

                <div className="relative mt-6 h-[360px] overflow-hidden rounded-[1.25rem] border border-slate-800 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#0f172a_100%)]">
                  <div className="mountain-scene">
                    <div className="mountain mountain-one" />
                    <div className="mountain mountain-two" />
                    <div className="mountain mountain-three" />
                  </div>

                  <div className="absolute inset-0">
                    {[...Array(14)].map((_, i) => (
                      <span key={i} className="ripple dot" style={{ left: `${(i * 9) % 100}%`, top: `${(i * 7) % 100}%`, animationDelay: `${i * 0.75}s` }} />
                    ))}
                  </div>

                  <div className="absolute left-6 top-8 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 shadow-lg">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">AI Risk Score</div>
                    <div className="mt-1 text-xl font-bold text-cyan-300">87%</div>
                    <div className="text-[10px] text-red-300 uppercase">High Risk</div>
                  </div>

                  <div className="absolute bottom-6 right-6 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 shadow-lg">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Rainfall</div>
                    <div className="mt-1 text-xl font-bold text-amber-300">124 mm</div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-900/20 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="pt-8">
          <div className="grid gap-4 md:grid-cols-5">
            {monitoringStats.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div key={item.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08, duration: 0.5 }} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-slate-800 p-2 text-cyan-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-emerald-400">{item.trend}</div>
                  </div>
                  <div className="mt-5 text-3xl font-bold text-white">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-300">{item.label}</div>
                </motion.div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function RiskGauge({ value }: { value: number }) {
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const getStatus = (v: number) => {
    if (v <= 25) return 'Low'
    if (v <= 50) return 'Moderate'
    if (v <= 75) return 'High'
    return 'Critical'
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
        <circle cx="110" cy="110" r={radius} stroke="#1e293b" strokeWidth="18" fill="none" />
        <circle cx="110" cy="110" r={radius} stroke={getRiskColor(value)} strokeWidth="18" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>

      <div className="absolute text-center">
        <div className="text-4xl font-black text-white">{value}</div>
        <div className="text-sm text-slate-400">/ 100</div>
        <div className="mt-2 text-xs uppercase tracking-[0.18em]" style={{ color: getRiskColor(value) }}>
          {getStatus(value)}
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Good Evening</div>
          <h2 className="mt-2 text-3xl font-bold text-white">Landslide Risk Monitoring Center</h2>
          <p className="mt-1 text-slate-400">North Eastern Region of India</p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Current Weather</div>
            <div className="flex items-center gap-2 text-white">
              <Wind className="h-4 w-4 text-cyan-300" />
              <span className="font-semibold">Heavy Rainfall</span>
            </div>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900/80 p-2.5 text-slate-200">
            <Bell className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Regional Risk Index</div>
              <div className="mt-2 text-4xl font-black text-white">72 / 100</div>
            </div>
            <div className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-amber-300">High Risk</div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-6 md:flex-row">
            <RiskGauge value={72} />
            <div className="flex-1 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Severity Trend</span>
                  <span className="text-emerald-400">↑ 8.4% vs yesterday</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-500" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Critical Zones</div>
                  <div className="mt-2 text-2xl font-bold text-white">05</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">At-risk Population</div>
                  <div className="mt-2 text-2xl font-bold text-white">1.8L</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Risk Distribution</div>
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={incidentData} dataKey="value" innerRadius={52} outerRadius={88} paddingAngle={2}>
                  {incidentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {incidentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Risk Trend</div>
            <TrendingUp className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="rain" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                <Bar dataKey="risk" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Alert Feed</div>
            <Bell className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="space-y-3">
            {alertFeed.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{alert.zone}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${alert.severity === 'Critical' ? 'bg-red-500/10 text-red-300' : alert.severity === 'High' ? 'bg-orange-500/10 text-orange-300' : 'bg-amber-500/10 text-amber-300'}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-300">{alert.detail}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{alert.time}</span>
                  <span>{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function RiskMapPage() {
  const position: [number, number] = [26.2, 93.8]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Live monitoring</div>
          <h2 className="mt-2 text-3xl font-bold text-white">Landslide Risk Map</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
          <MapPinned className="h-4 w-4 text-cyan-300" />
          North Eastern Region
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/80">
          <div className="h-[640px]">
            <MapContainer center={position} zoom={6} scrollWheelZoom className="h-full w-full">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mapMarkers.map((marker) => {
                const customIcon = L.divIcon({
                  className: 'custom-pin',
                  html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${markerColor(marker.risk)}; border:2px solid white; box-shadow:0 0 16px ${markerColor(marker.risk)};"></span>`,
                  iconSize: [18, 18],
                  iconAnchor: [9, 9]
                })

                return (
                  <Marker key={marker.name} position={marker.position} icon={customIcon}>
                    <Popup>
                      <div className="text-sm text-slate-800">
                        <strong>{marker.name}</strong>
                        <br />
                        Risk level: {marker.risk}
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Map Layers</div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              {['Satellite', 'Terrain', 'Rainfall', 'Risk Zones', 'Sensors'].map((layer) => (
                <div key={layer} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span>{layer}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">On</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Legend</div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Low', color: '#10b981' },
                { label: 'Moderate', color: '#fbbf24' },
                { label: 'High', color: '#f97316' },
                { label: 'Critical', color: '#ef4444' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function AlertsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Early warning</div>
        <h2 className="mt-2 text-3xl font-bold text-white">Alert Management</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {alertFeed.map((alert) => (
            <div key={alert.id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-white">{alert.zone}</div>
                  <div className="mt-1 text-sm text-slate-400">{alert.time}</div>
                </div>
                <div className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${alert.severity === 'Critical' ? 'bg-red-500/10 text-red-300' : alert.severity === 'High' ? 'bg-orange-500/10 text-orange-300' : 'bg-amber-500/10 text-amber-300'}`}>
                  {alert.severity}
                </div>
              </div>

              <div className="mt-4 text-slate-300">{alert.detail}</div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">Acknowledge</button>
                <button className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white">Escalate</button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Alert Summary</div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Total Active Alerts</div>
              <div className="mt-2 text-3xl font-bold text-white">07</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Escalated</div>
              <div className="mt-2 text-3xl font-bold text-red-300">03</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Teams Notified</div>
              <div className="mt-2 text-3xl font-bold text-cyan-300">14</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Forecasting</div>
        <h2 className="mt-2 text-3xl font-bold text-white">Historical & Predictive Analytics</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-400">Rainfall vs Risk</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="rain" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                <Bar dataKey="risk" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-400">Zone Distribution</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={incidentData} dataKey="value" innerRadius={55} outerRadius={88} paddingAngle={3}>
                  {incidentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-4">
        {[
          { label: 'Forecast Accuracy', value: '92%', color: 'text-cyan-300' },
          { label: 'Warning Lead Time', value: '18 hrs', color: 'text-amber-300' },
          { label: 'Critical Events', value: '12', color: 'text-red-300' },
          { label: 'Active Sensors', value: '342', color: 'text-emerald-300' }
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-sm text-slate-400">{stat.label}</div>
            <div className={`mt-3 text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </main>
  )
}

function LocationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">High-risk sites</div>
        <h2 className="mt-2 text-3xl font-bold text-white">Critical Locations</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {locations.map((loc) => (
          <div key={loc.name} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{loc.name}</div>
              <div className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${loc.risk === 'Critical' ? 'bg-red-500/10 text-red-300' : loc.risk === 'High' ? 'bg-orange-500/10 text-orange-300' : 'bg-amber-500/10 text-amber-300'}`}>
                {loc.risk}
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Region</span>
                <span>{loc.region}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Score</span>
                <span className="font-semibold text-white">{loc.score}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Status</span>
                <span>{loc.status}</span>
              </div>
            </div>

            <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white">
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-7">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Project overview</div>
        <h2 className="mt-3 text-3xl font-bold text-white">AI-Based Early Warning & Landslide Risk Monitoring</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold text-white">Purpose</div>
            <p className="mt-2 text-sm text-slate-300">Detect early landslide risks across vulnerable zones in the North Eastern Region using predictive AI models and sensor data.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <Waves className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold text-white">Technology</div>
            <p className="mt-2 text-sm text-slate-300">Combines rainfall trends, topographic instability, ground movement, and historical incident analytics to increase situational awareness.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold text-white">Impact</div>
            <p className="mt-2 text-sm text-slate-300">Supports disaster response teams with timely alerts, operational clarity, and better preparedness before rainfall-triggered slope failures.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

function MainLayout() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 opacity-40">
          <div className="topo-pattern absolute inset-0" />
        </div>
        <div className="absolute inset-0">
          {[...Array(28)].map((_, i) => (
            <span key={i} className="float-particle" style={{ left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%`, animationDelay: `${i * 0.7}s` }} />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/risk-map" element={<RiskMapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return <MainLayout />
}
