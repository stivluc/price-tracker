'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="mt-2 text-2xl font-semibold">Page introuvable</h2>
          <p className="mt-2 text-muted-foreground">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
} 