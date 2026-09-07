export default function Loading() {
  return (
    <main className="flex items-center justify-center min-h-[60vh] gap-3">
      <div
        className="w-10 h-10 rounded-full bg-[#f495bf] animate-load"
        style={{ animationDelay: "0ms" }}
      />

      <div
        className="w-10 h-10 rounded-full bg-[#f495bf] animate-load"
        style={{ animationDelay: "150ms" }}
      />

      <div
        className="w-10 h-10 rounded-full bg-[#f495bf] animate-load"
        style={{ animationDelay: "300ms" }}
      />
    </main>
  );
}