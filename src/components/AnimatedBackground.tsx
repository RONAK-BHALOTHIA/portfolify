export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob blob-a bg-indigo-600 -top-40 -left-40 h-[520px] w-[520px]" />
      <div className="blob blob-b bg-fuchsia-600 top-1/3 -right-40 h-[480px] w-[480px]" />
      <div className="blob blob-c bg-cyan-500 -bottom-40 left-1/4 h-[500px] w-[500px]" />
      <div className="bg-grid absolute inset-0" />
    </div>
  );
}