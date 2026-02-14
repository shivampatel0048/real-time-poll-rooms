"use client";

import React from "react";
import { clsx } from "clsx";
import { CircleCheck } from "lucide-react";
import type { PollOptionItemProps } from "@/types/components";

export function PollOptionItem({
  option,
  totalVotes,
  isSelected,
  hasVoted,
  isUserSelection = false,
  onSelect,
}: PollOptionItemProps) {
  const voteCount = option.voteCount ?? 0;
  const percentage = totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;

  return (
    <button
      type="button"
      onClick={() => !hasVoted && onSelect(option.id)}
      disabled={hasVoted}
      className={clsx(
        "group relative w-full overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-300",
        hasVoted
          ? "cursor-default"
          : "cursor-pointer hover:border-vibrant-red hover:shadow-md",
        isSelected && !hasVoted && "border-vibrant-red bg-light-red",
        isUserSelection && hasVoted && "border-green-600 bg-green-50",
        !isSelected && !isUserSelection && !hasVoted && "border-gray-300",
        hasVoted && !isUserSelection && "border-gray-300",
      )}
      aria-label={`${option.text}${hasVoted ? `, ${option.voteCount} votes, ${percentage.toFixed(1)}%` : ""}${isUserSelection ? ", your selection" : ""}`}
    >
      {hasVoted && (
        <div
          className="absolute inset-0 bg-vibrant-red/20 transition-all duration-500"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{option.text}</span>
          {isUserSelection && hasVoted && (
            <CircleCheck className="h-5 w-5 text-green-600" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            {voteCount} {voteCount === 1 ? "vote" : "votes"}
          </span>
          <span className="text-lg font-bold text-vibrant-red">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </button>
  );
}
