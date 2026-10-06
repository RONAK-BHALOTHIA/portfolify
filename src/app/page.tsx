import AnimatedBackground from "@/components/AnimatedBackground";
import Link from "next/link";

const features = [
  {
    title: "10 templates",
    text: "Light, dark, serif, and bold designs. Preview each one with your own details before you choose.",
  },
  {
    title: "Live editing",
    text: "Type your name, bio, skills, and projects and watch the portfolio update right next to the form.",
  },
  {
    title: "AI writing help",
    text: "Improve your bio and project descriptions with AI. You see the suggestion first and choose whether to keep it.",
  },
  {
    title: "Real project export",
    text: "Download a complete Next.js project as a ZIP. It runs on its own, without Portfolify.",
  },
  {
    title: "Push to GitHub",
    text: "Create a repository from the generated project in one click, if you want one.",
  },
  {
    title: "Ready to deploy",
    text: "Import the repository into Vercel and your portfolio gets a live link.",
  },
];

const steps = [
  { n: "1", title: "Pick a template", text: "Browse the gallery and open a live preview." },
  { n: "2", title: "Add your details", text: "Fill in the form and see the page update as you type." },
  { n: "3", title: "Improve with AI", text: "Tighten your bio and project descriptions." },
  { n: "4", title: "Download or push", text: "Get the ZIP, or send it straight to GitHub." },
  { n: "5", title: "Deploy", text: "Put it online with Vercel." },
];

export default function Home() {
  return (
     <div className="relative isolate min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      {/* Nav */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold">Portfolify</span>
          <Link
            href="/portfolio/templates"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-indigo-400 text-sm font-medium mb-4">Portfolio builder for developers</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
          Build your portfolio.{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Own the code.
          </span>
        </h1>
        <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
          Pick a template, add your details, and get a complete project you can download, push to GitHub, and deploy.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-10">
          <Link
            href="/portfolio/templates"
            className="px-6 py-3 rounded-lg bg-indigo-600 font-medium hover:bg-indigo-500"
          >
            Choose a template
          </Link>
          <Link
            href="/portfolio/builder"
            className="px-6 py-3 rounded-lg border border-slate-700 font-medium hover:border-slate-500"
          >
            Open the builder
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center">What you get</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mt-10">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold mx-auto">
                  {s.n}
                </div>
                <h3 className="font-semibold mt-4">{s.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to build yours?</h2>
        <p className="text-slate-400 mt-3">It takes a few minutes to go from template to live site.</p>
        <Link
          href="/portfolio/templates"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-indigo-600 font-medium hover:bg-indigo-500"
        >
          Get started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
          <span>Portfolify</span>
          <span>Built with Next.js and Claude</span>
        </div>
      </footer>
    </div>
  );
}