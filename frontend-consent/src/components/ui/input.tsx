import React from "react";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`border px-4 py-2 rounded w-full ${className}`} {...props} />;
}
