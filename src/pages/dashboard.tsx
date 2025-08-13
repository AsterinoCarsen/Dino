import { useRouter } from "next/router";

export default function Dashboard() {
    const router = useRouter();

    function handleGoHome() {
        router.push("/");
    }

  return (
    <div className="min-h-screen bg-dino-dark text-dino-text flex">
      {/* Sidebar / Navigation */}
      <aside className="w-56 flex-shrink-0 border-r border-dino-border p-6 flex flex-col">
        <button onClick={handleGoHome} className="text-3xl cursor-pointer hover:text-gray-400 transition text-left font-bold mb-12">Dino</button>
        <nav className="flex flex-col space-y-6">
          <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Dashboard</a>
          <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Logbook</a>
          <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Insights</a>
          <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Profile</a>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 ml-12 mr-12 overflow-y-auto">
        {/* Welcome + Quick Stats */}
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Welcome back, Carsen!</h2>
              <p className="text-gray-400">Here’s your climbing summary.</p>
            </div>
            <button className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow transition">
              + Log New Ascent
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <StatCard label="Current ELO" value="1420" change="+15 this week" />
            <StatCard label="Climbing Volume (Last 7 days)" value="350 ft" change="+32 ft this week" />
            <StatCard label="Best Grade" value="V6" change="No change" />
            <StatCard label="Avg Attempts/Send" value="3.2" change="-0.2 attempts this week" />
          </div>
        </Card>

        {/* Performance Snapshot */}
        <Card title="Performance Snapshot">
          <div className="h-48 flex items-center justify-center text-gray-500 border border-dino-border rounded-lg">
            [Grade Progression Chart Placeholder]
          </div>
        </Card>

        {/* Training Goals */}
        <Card title="Focus Areas">
          <ul className="space-y-2">
            <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
              Overhang endurance <span className="text-red-400">(42% success rate)</span>
            </li>
            <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
              Crimps strength <span className="text-red-400">(3 misses at V5+ last week)</span>
            </li>
          </ul>
          <a href="#" className="inline-block mt-4 text-emerald-400 hover:underline">
            View Full Insights →
          </a>
        </Card>

        {/* Recent Ascents */}
        <Card title="Recent Ascents">
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            <AscentItem
              name="Route #21"
              grade="V4"
              type="Lead"
              date="Aug 4, 2025"
              attempts={2}
              style="Technical"
            />
            <AscentItem
              name="Boulder #17"
              grade="V6"
              type="Boulder"
              date="Aug 3, 2025"
              attempts={5}
              style="Overhang"
            />
            {/* More items scrollable */}
          </div>
          <a href="#" className="inline-block mt-4 text-emerald-400 hover:underline">
            See All in Logbook →
          </a>
        </Card>

        {/* Badges */}
        <Card title="Badges Earned This Week">
          <div className="flex flex-wrap gap-3">
            <Badge icon="🥇" label="Grade Crusher V6" />
            <Badge icon="🔥" label="7-Day Send Streak" />
          </div>
        </Card>
      </main>
    </div>
  );
}

/* Reusable Components */
function Card({ children, title, className = '' }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <section className={`bg-dino-card border border-dino-border rounded-2xl p-6 mb-8 shadow-lg transition hover:shadow-xl ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      {children}
    </section>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {

    const isPositive = change?.startsWith('+');
    const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-dino-border shadow-inner">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className={`${changeColor} text-sm`}>{change}</p>
        </div>
    );
}

function AscentItem({
  name,
  grade,
  type,
  date,
  attempts,
  style,
}: {
  name: string;
  grade: string;
  type: string;
  date: string;
  attempts: number;
  style: string;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-dino-border shadow-inner">
      <p className="font-semibold">{name} ({grade}) — {type}</p>
      <p className="text-gray-400 text-sm">{date} | Attempts: {attempts} | Style: {style}</p>
    </div>
  );
}

function Badge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-dino-border">
      <span>{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
