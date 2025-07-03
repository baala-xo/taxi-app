"use client";

import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
          உலா
        </h1>
        <p className="text-lg text-muted-foreground">
          The modern taxi booking app for drivers and customers. Seamless. Secure. Simple.
        </p>
        
        {/* Taxi Hero Image */}
        <div className="relative">
        <img
  src="/taxi-hero.svg"
  alt="Taxi illustration"
  className="w-80 md:w-[28rem] animate-bounce-slow mx-auto pb-6"
/>

        </div>

        <Link
  href="/login"
  className="inline-block px-6 py-3 rounded-lg text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl"
  style={{
    backgroundColor: "var(--primary)",
    boxShadow: "0 4px 20px var(--ring)",
  }}
>
  Book or Drive Now
</Link>

{/* GitHub source link */}
<a
  href="https://github.com/baala-xo/taxi-app"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors pl-6 border-border border-foreground"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5 mr-1"
  >
    <path
      d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 
      11.385.6.113.793-.258.793-.577
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
      -.546-1.387-1.333-1.757-1.333-1.757
      -1.09-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236
      1.07 1.834 2.807 1.304 3.492.997
      .108-.775.418-1.305.76-1.605-2.665-.3-5.467-1.334-5.467-5.93
      0-1.31.47-2.38 1.235-3.22
      -.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.48 
      11.48 0 013.003-.404c1.02.005 2.045.138 
      3.003.404 2.28-1.552 3.285-1.23 3.285-1.23
      .645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22
      0 4.61-2.807 5.625-5.48 5.92.435.375.81 1.096.81 2.21
      0 1.595-.015 2.88-.015 3.28 0 .315.195.69.8.57C20.565 21.795 
      24 17.303 24 12c0-6.627-5.373-12-12-12z"
    />
  </svg>
  View Source on GitHub
</a>      </div>
    </main>
  );
}
