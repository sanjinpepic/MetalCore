import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

import Footer from '@/components/Footer';

export default async function TermsPage() {
    const filePath = path.join(process.cwd(), 'public', 'legal', 'terms-of-service.md');
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const html = marked(markdown);

    return (
        <div className="h-screen w-full overflow-y-auto bg-[#0B0A08] flex flex-col">
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel p-8 rounded-2xl border border-[#EDE9E2]/[0.08]">
                        <div
                            className="prose prose-invert max-w-none
                  prose-headings:text-[#EDE9E2] prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-accent
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-accent-300
                  prose-p:text-[#A39E93] prose-p:leading-relaxed
                  prose-a:text-accent prose-a:no-underline hover:prose-a:text-accent-400
                  prose-strong:text-[#EDE9E2] prose-strong:font-semibold
                  prose-ul:text-[#A39E93] prose-ol:text-[#A39E93]
                  prose-li:my-1"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        <div className="mt-8 pt-6 border-t border-[#EDE9E2]/[0.08]">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-400 text-[#1A0C05] font-semibold uppercase tracking-wider text-sm shadow-lg shadow-accent/25 transition duration-200 hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to App
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
