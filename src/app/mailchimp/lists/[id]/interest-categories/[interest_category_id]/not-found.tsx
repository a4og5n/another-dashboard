import { BackButton } from "@/components/not-found";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">
        404 - Interest Category Info Not Found
      </h2>
      <p className="text-muted-foreground">
        Details for a specific interest category
      </p>
      <BackButton />
    </div>
  );
}
