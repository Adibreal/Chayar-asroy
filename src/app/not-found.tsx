import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="font-display text-6xl text-primary">404</p>
      <h1 className="font-display text-3xl text-foreground">Page not found</h1>
      <p className="max-w-prose text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link href="/" className="font-medium text-primary underline underline-offset-4">
        Return home
      </Link>
    </div>
  );
}
