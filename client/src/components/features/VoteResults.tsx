"use client";

import React from "react";
import { PollOptionItem } from "./PollOptionItem";
import type { VoteResultsProps } from "@/types/components";

export function VoteResults({
  options,
  totalVotes,
  hasVoted,
}: VoteResultsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Total votes: <span className="font-semibold">{totalVotes}</span>
      </p>
      <div className="space-y-3">
        {options.map((option) => (
          <PollOptionItem
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            isSelected={false}
            hasVoted={hasVoted}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
