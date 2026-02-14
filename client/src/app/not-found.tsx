"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main
      className="min-h-screen bg-linear-to-b from-white to-light-red/20 flex items-center justify-center relative overflow-hidden"
      role="main"
      aria-labelledby="error-heading"
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-vibrant-red/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-light-red/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1
              id="error-heading"
              className="text-[10rem] md:text-[12rem] lg:text-[15rem] font-black text-vibrant-red/10 leading-none tracking-tighter"
              aria-label="Error 404"
            >
              404
            </h1>
            <div className="-mt-20 md:-mt-24 lg:-mt-28">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-vibrant-red/20 bg-vibrant-red/5 text-vibrant-red text-xs font-bold uppercase tracking-[0.2em] mb-6"
                role="status"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vibrant-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-vibrant-red"></span>
                </span>
                Error Code
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-navy">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist in our poll
              rooms. Let&apos;s get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <nav
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            aria-label="Error page navigation"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-vibrant-red text-white font-bold px-10 py-4  hover:bg-vibrant-red/90 transition-all uppercase tracking-widest text-xs shadow shadow-vibrant-red/20"
              aria-label="Return to home page"
            >
              <Home className="size-4" aria-hidden="true" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold px-10 py-4 hover:border-vibrant-red hover:text-vibrant-red transition-all uppercase tracking-widest text-xs"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Go Back
            </button>
          </nav>

          {/* Additional Info */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400"
              role="status"
            >
              Error Reference: POLL-404-NF
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
