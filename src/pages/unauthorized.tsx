// src/pages/unauthorized.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle size={64} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h1>
        
        <p className="text-gray-600 mb-6">
          You do not have permission to access this area. This section requires admin privileges.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button variant="default" onClick={() => navigate("/")}>
            Return to Home
          </Button>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}