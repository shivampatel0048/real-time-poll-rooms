import { fetchPoll } from "@/lib/api";
import { PollRoom } from "@/components/features/PollRoom";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  try {
    const { pollId } = await params;
    const poll = await fetchPoll(pollId);

    return {
      title: `${poll.question} - Real-Time Poll`,
      description: `Vote on: ${poll.question}`,
      openGraph: {
        title: poll.question,
        description: "Real-time poll results",
        url: `${process.env.NEXT_PUBLIC_API_URL}/poll/${pollId}`,
      },
    };
  } catch {
    return {
      title: "Poll Not Found",
    };
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const { pollId } = await params;

  let poll;
  try {
    poll = await fetchPoll(pollId);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 bg-white/80 px-4 py-2 text-sm font-medium text-navy transition-all hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Create a new poll
        </Link>

        <PollRoom initialData={poll} />
      </div>
    </main>
  );
}
