"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { submitVote } from "@/lib/api";
import { toast } from "react-toastify";
import type { Poll, VoteUpdate } from "@/types/api";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { Send, Eye, Share2, Copy, CircleCheck, BadgeCheck } from "lucide-react";

interface PollRoomProps {
  initialData: Poll;
}

export function PollRoom({ initialData }: PollRoomProps) {
  const [poll, setPoll] = useState<Poll>({
    ...initialData,
    totalVotes: initialData.totalVotes ?? 0,
    options:
      initialData.options?.map((opt) => ({
        ...opt,
        voteCount: opt.voteCount ?? 0,
      })) ?? [],
  });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userSelectedOptionId, setUserSelectedOptionId] = useState<
    string | null
  >(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Load user's previous selection from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`poll_${poll.id}_selection`);
    if (stored) {
      const { selectedOptionId: storedOptionId, hasVoted: storedHasVoted } =
        JSON.parse(stored);
      setUserSelectedOptionId(storedOptionId);
      setHasVoted(storedHasVoted);
      if (!storedHasVoted) {
        setSelectedOptionId(storedOptionId);
      }
    }
  }, [poll.id]);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("join_poll_room", poll.id);

    socket.on("vote_update", (data: VoteUpdate) => {
      setPoll((prev) => ({
        ...prev,
        options:
          data.options?.map((opt) => ({
            ...opt,
            voteCount: opt.voteCount ?? 0,
          })) ?? prev.options,
        totalVotes: data.totalVotes ?? 0,
      }));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("vote_update");
      socket.off("connect_error");
      disconnectSocket();
    };
  }, [poll.id]);

  const handleVote = async (): Promise<void> => {
    if (!selectedOptionId || hasVoted) return;

    setIsVoting(true);
    try {
      await submitVote({
        pollId: poll.id,
        optionId: selectedOptionId,
      });
      setHasVoted(true);
      setUserSelectedOptionId(selectedOptionId);

      // Store user's selection in localStorage
      localStorage.setItem(
        `poll_${poll.id}_selection`,
        JSON.stringify({
          selectedOptionId,
          hasVoted: true,
        }),
      );

      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center sm:p-4 md:p-10">
      <div className="w-full max-w-150 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 border-b border-slate-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-vibrant-red/10 text-vibrant-red text-[10px] font-bold uppercase tracking-wider rounded">
              Active Poll
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Live Results
            </span>
          </div>
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
            {poll.question}
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-normal">
            Cast your vote and see real-time results.
          </p>
        </div>

        {!hasVoted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVote();
            }}
            className="p-4 sm:p-6 md:p-8 space-y-4"
          >
            {poll.options?.map((option, index) => {
              const voteCount = option.voteCount ?? 0;
              const percentage =
                poll.totalVotes === 0 ? 0 : (voteCount / poll.totalVotes) * 100;
              const gradientColors = [
                "to-red-50",
                "to-blue-50",
                "to-green-50",
                "to-yellow-50",
                "to-purple-50",
                "to-pink-50",
                "to-indigo-50",
                "to-orange-50",
              ];
              const gradientColor =
                gradientColors[index % gradientColors.length];
              return (
                <label
                  key={option.id}
                  className="min-h-14 bg-white border-2 border-slate-200 p-4 relative overflow-hidden cursor-pointer hover:border-vibrant-red/40 transition-all active:scale-[0.99] block"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-r from-transparent ${gradientColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <div className="relative flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input
                        checked={selectedOptionId === option.id}
                        onChange={() => setSelectedOptionId(option.id)}
                        className="h-5 w-5 border-2 border-slate-300 bg-transparent text-vibrant-red focus:ring-vibrant-red/20 focus:ring-offset-0"
                        name="option"
                        type="radio"
                        value={option.id}
                      />
                      <span className="text-base font-semibold text-slate-800">
                        {option.text}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-vibrant-red">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </label>
              );
            })}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!selectedOptionId || isVoting}
                className="w-full rounded-none flex items-center justify-center gap-2 h-14 px-6 bg-vibrant-red text-white text-lg font-bold tracking-tight hover:bg-vibrant-red/90 transition-all"
              >
                <span>{isVoting ? "Submitting..." : "Cast Vote"}</span>
                {!isVoting && <Send className="h-5 w-5" />}
                {isVoting && <LoadingSpinner size="sm" />}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="space-y-4">
              {poll.options?.map((option, index) => {
                const voteCount = option.voteCount ?? 0;
                const percentage =
                  poll.totalVotes === 0
                    ? 0
                    : (voteCount / poll.totalVotes) * 100;
                const isUserSelection = userSelectedOptionId === option.id;
                const gradientColors = [
                  "to-red-50",
                  "to-blue-50",
                  "to-green-50",
                  "to-yellow-50",
                  "to-purple-50",
                  "to-pink-50",
                  "to-indigo-50",
                  "to-orange-50",
                ];
                const gradientColor =
                  gradientColors[index % gradientColors.length];
                return (
                  <div
                    key={option.id}
                    className="min-h-14 bg-white border-2 border-slate-200 p-4 relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-r from-transparent ${gradientColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="relative flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {isUserSelection && (
                          <div className="h-5 w-5 flex items-center justify-center">
                            <CircleCheck className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {!isUserSelection && <div className="h-5 w-5"></div>}
                        <span className="text-base font-semibold text-slate-800">
                          {option.text}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-vibrant-red">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 p-6 text-center shadow-inner">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BadgeCheck className="h-5 w-5 text-green-600" />
                <p className="font-bold text-green-800 text-lg">
                  Thank you for voting!
                </p>
              </div>
              <p className="text-sm text-green-700">
                Results update in real-time as others vote
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {poll.totalVotes ?? 0} Votes
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 text-slate-500">
        <span className="text-sm font-semibold uppercase tracking-wider">
          Share this poll:
        </span>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && navigator.share) {
              navigator.share({
                title: poll.question,
                text: "Check out this poll",
                url: `${window.location.origin}/poll/${poll.id}`,
              });
            } else {
              navigator.clipboard.writeText(
                `${typeof window !== "undefined" ? window.location.origin : ""}/poll/${poll.id}`,
              );
              toast.success("Link copied!");
            }
          }}
          className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-vibrant-red hover:text-white hover:border-vibrant-red transition-all"
        >
          <Share2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${typeof window !== "undefined" ? window.location.origin : ""}/poll/${poll.id}`,
            );
            toast.success("Link copied!");
          }}
          className="size-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-vibrant-red hover:text-white hover:border-vibrant-red transition-all"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
