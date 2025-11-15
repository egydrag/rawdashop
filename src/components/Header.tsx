import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow mb-6">
      <div className="container mx-auto p-4 flex justify-center">
        <h1 className="text-xl font-semibold text-pink-600">
          متجر روضة للإكسسوارات <Link href={"/dashboard"}>💕</Link>
        </h1>
      </div>
    </header>
  );
}
