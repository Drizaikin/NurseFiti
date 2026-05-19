'use client';

import { NurseFitiLogo } from '@/components/shared/NurseFitiLogo';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <NurseFitiLogo size="lg" className="mx-auto mb-8" />

        <div className="bg-white dark:bg-white border border-border rounded-lg p-8 shadow">
          {/* Icon */}
          <div className="w-20 h-20 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-syne text-2xl font-bold text-dark mb-3">
            Application Under Review
          </h1>
          <p className="text-mid mb-6">
            Thank you for applying to become a NurseFiti Expert Tutor! We're reviewing your
            credentials and will get back to you within <strong>48 hours</strong>.
          </p>

          {/* What's Being Verified */}
          <div className="bg-teal-xlight border border-teal-light rounded-lg p-5 mb-6 text-left">
            <h3 className="font-semibold text-dark text-sm mb-3">
              What We're Verifying:
            </h3>
            <ul className="space-y-2 text-sm text-dark">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>NCK Registration Number against official records</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Academic qualifications and professional credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Identity verification for M-Pesa payouts</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-amber-light border border-amber rounded-lg p-5 mb-6 text-left">
            <h3 className="font-semibold text-dark text-sm mb-3">
              📬 You'll Receive:
            </h3>
            <ul className="space-y-2 text-sm text-dark">
              <li>• Email notification with approval status</li>
              <li>• WhatsApp message with next steps</li>
              <li>• Access to your tutor dashboard (if approved)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/">
              <Button variant="secondary" fullWidth>
                Return to Homepage
              </Button>
            </Link>
            <Link href="/login?role=tutor">
              <Button variant="outline" fullWidth>
                Check Application Status
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact */}
        <p className="text-sm text-mid mt-6">
          Questions?{' '}
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal font-semibold hover:underline"
          >
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
