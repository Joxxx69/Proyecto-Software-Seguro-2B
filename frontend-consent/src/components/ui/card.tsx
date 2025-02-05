import React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}
