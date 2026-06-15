'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/helpers'

interface NewArticleToastProps {
  article: {
    title: string
    slug: string
    heroImage?: {
      url: string
      alt?: string
    }
  }
}

export function NewArticleToast({ article }: NewArticleToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already dismissed this specific article toast in this session
    const dismissed = sessionStorage.getItem(`dismissed-toast-${article.slug}`)
    if (!dismissed) {
      // Delay the toast slightly so it doesn't immediately yell at them on load
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [article.slug])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem(`dismissed-toast-${article.slug}`, 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl bg-cbc-darker/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 flex flex-col gap-3 group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cbc-gold/10 to-transparent pointer-events-none" />
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/5 text-cbc-muted hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cbc-gold/20 text-cbc-gold">
                <Sparkles size={12} />
              </span>
              <span className="text-xs font-label uppercase tracking-widest text-cbc-gold font-bold">New Post</span>
            </div>

            <div className="flex gap-4">
              {article.heroImage && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
                  <Image 
                    src={article.heroImage.url} 
                    alt={article.heroImage.alt || article.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-heading font-bold text-white line-clamp-2 leading-tight">
                  {article.title}
                </h4>
                <Link 
                  href={`/articles/${article.slug}`}
                  onClick={() => sessionStorage.setItem(`dismissed-toast-${article.slug}`, 'true')}
                  className="text-xs text-cbc-muted hover:text-cbc-gold font-body underline mt-2 w-fit transition-colors"
                >
                  Read the article &rarr;
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
