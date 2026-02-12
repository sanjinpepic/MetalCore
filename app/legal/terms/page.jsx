import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

import Footer from '@/components/Footer';

export default async function TermsPage() {
    const filePath = path.join(process.cwd(), 'public', 'legal', 'terms-of-service.md');
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const html = marked(markdown);

    return (
        <div className="h-screen w-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/20 flex flex-col">
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <div
                            className="prose prose-invert prose-emerald max-w-none
                  prose-headings:text-white prose-headings:font-display
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:bg-gradient-to-r prose-h1:from-emerald-400 prose-h1:to-teal-400 prose-h1:bg-clip-text prose-h1:text-transparent
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-emerald-400
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-emerald-300
                  prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300
                  prose-strong:text-white prose-strong:font-semibold
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:my-1"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
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
