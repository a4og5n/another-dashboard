import { BackButton } from "@/components/not-found";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">
        404 - List Growth History Not Found
      </h2>
      <p className="text-muted-foreground">
        Historical growth data showing list size over time
      </p>
      <BackButton />
    </div>
  );
}
