import { cn } from "@/lib/utils/helpers";
// @ts-expect-error local js module import
import { marked } from '@/lib/marked.js';

interface ProseContentProps {
    html: string;
    className?: string;
}

export function ProseContent({ html, className }: ProseContentProps) {
    if (!html) return null;

    // The 'html' prop receives raw Markdown from Keystatic
    let parsedHtml = typeof marked.parse === 'function' ? marked.parse(html) : html;

    // Editorial Enhancement: Add drop-cap to the first paragraph that contains text
    if (typeof parsedHtml === 'string') {
        const pMatches = Array.from(parsedHtml.matchAll(/<p[^>]*>(.*?)<\/p>/g));
        
        for (const pMatch of pMatches) {
            const content = pMatch[1];
            let letterIndex = -1;
            let inTag = false;
            
            for (let i = 0; i < content.length; i++) {
                if (content[i] === '<') { inTag = true; continue; }
                if (content[i] === '>') { inTag = false; continue; }
                if (!inTag && /[a-zA-Z]/.test(content[i])) {
                    letterIndex = i;
                    break;
                }
            }

            if (letterIndex !== -1) {
                const letter = content[letterIndex];
                const beforeLetter = content.slice(0, letterIndex);
                const afterLetter = content.slice(letterIndex + 1);
                
                const dropCapP = `<p class="editorial-paragraph">${beforeLetter}<span class="drop-cap">${letter}</span>${afterLetter}</p>`;
                parsedHtml = parsedHtml.replace(pMatch[0], dropCapP);
                break; // Only apply to the first valid paragraph
            }
        }
    }

    return (
        <div 
            className={cn(
                // Typography & Layout
                "prose prose-invert prose-lg max-w-none mx-auto break-words",
                
                // Headings
                "prose-headings:font-display prose-headings:font-bold prose-headings:text-cbc-white prose-headings:tracking-tight",
                "prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:font-heading prose-h2:border-l-4 prose-h2:border-cbc-crimson prose-h2:pl-6",
                "prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:font-heading prose-h3:text-cbc-gold",
                "prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4 text-cbc-white/90 font-heading",
                
                // Body Text
                "prose-p:font-body prose-p:text-cbc-white/80 prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-lg",
                
                // Links
                "prose-a:text-cbc-crimson prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-cbc-crimson/80 prose-a:transition-all",
                
                // Lists
                "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:text-cbc-white/70",
                "prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8 prose-ol:text-cbc-white/70",
                "prose-li:mb-3 prose-li:font-body",
                
                // Blockquotes (Editorial Pull Quotes)
                "prose-blockquote:border-l-4 prose-blockquote:border-cbc-crimson prose-blockquote:pl-8 prose-blockquote:py-4",
                "prose-blockquote:bg-cbc-crimson/5 prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-xl",
                "prose-blockquote:italic prose-blockquote:text-cbc-white prose-blockquote:font-heading prose-blockquote:text-2xl",
                "prose-blockquote:my-12 prose-blockquote:shadow-cbc",
                
                // Images directly in content
                "prose-img:rounded-2xl prose-img:shadow-[0_0_50px_rgba(0,0,0,0.5)] prose-img:my-12 prose-img:border prose-img:border-white/10",
                
                // Strong/Bold
                "prose-strong:text-cbc-white prose-strong:font-extrabold",
                
                // HR (Stylized Divider)
                "prose-hr:border-cbc-border prose-hr:my-16 prose-hr:border-t-2 prose-hr:opacity-30",
                
                // Custom additions
                className
            )}
            dangerouslySetInnerHTML={{ __html: parsedHtml as string }}
        />
    );
}
