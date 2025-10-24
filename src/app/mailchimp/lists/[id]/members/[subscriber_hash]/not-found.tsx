import { BackButton } from "@/components/not-found";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">404 - Member Not Found</h2>
      <p className="text-muted-foreground">
        The requested member profile could not be found. They may have been
        removed or the subscriber hash is invalid.
      </p>
      <BackButton />
    </div>
  );
}
