"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, Copy, Share2 } from "lucide-react";
import type { ShareLinkCardProps } from "@/types/components";

export function ShareLinkCard({ pollId }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/poll/${pollId}`);
  }, [pollId]);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-5 w-5 text-blue-600" />
          Share this poll
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {shareUrl ? (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                aria-label="Share link"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                className="shrink-0"
                aria-label={copied ? "Copied" : "Copy link"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Anyone with this link can vote on your poll
            </p>
          </>
        ) : (
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
        )}
      </CardContent>
    </Card>
  );
}
