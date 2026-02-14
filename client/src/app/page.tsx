"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PollForm } from "@/components/features/PollForm";
import { createPoll } from "@/lib/api";
import { toast } from "react-toastify";
import type { CreatePollRequest } from "@/types/api";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePollRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await createPoll(data);
      toast.success("Poll created successfully!");
      router.push(`/poll/${result.pollId}`);
    } catch (error) {
      console.error("Create poll error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl md:text-5xl font-bold text-navy">
            Real-Time Poll Rooms
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Create polls, share links, and watch results update in real-time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 md:p-12">
          <PollForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Create unlimited polls • Real-time results • No sign-up required
          </p>
        </div>
      </div>
    </main>
  );
}
