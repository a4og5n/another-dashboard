/**
 * Not Found page for List Segments
 * Displayed when the requested list does not exist
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto border-yellow-200 bg-yellow-50">
        <CardHeader className="text-center">
          <AlertCircle className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
          <CardTitle className="text-yellow-800">List Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-yellow-700">
            The requested list could not be found. It may have been deleted or
            you may not have permission to access it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
