import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({
  className = "",
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
