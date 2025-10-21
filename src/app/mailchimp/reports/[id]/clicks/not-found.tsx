import { BackButton } from "@/components/not-found";

export default function NotFound() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">404 - Click Details Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          The click details for this campaign could not be found. The campaign
          may not exist or the click tracking endpoint may not be available.
        </p>
        <BackButton />
      </div>
    </div>
  );
}
