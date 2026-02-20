"use client";

import { useState, useCallback, useEffect } from "react";
import { chapters } from "@/data/storyData";
import BookCover from "./BookCover";
import BookPage from "./BookPage";
import BookShayariPage from "./BookShayariPage";
import TableOfContents from "./TableOfContents";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const Book = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const totalPages = chapters.length * 2 + 1;

  const handleOpen = () => {
    setIsOpen(true);
  };

  // 🔥 FAST FLIP LOGIC
  const flipToPage = useCallback(
    (targetPage: number) => {
      if (isAnimating || targetPage < 0 || targetPage >= totalPages) return;

      setIsAnimating(true);

      const newFlipped = new Set<number>();
      for (let i = 0; i < targetPage; i++) {
        newFlipped.add(i);
      }

      setFlippedPages(newFlipped);
      setCurrentPage(targetPage);

      setTimeout(() => setIsAnimating(false), 500); // ⬅ faster
    },
    [isAnimating, totalPages]
  );

  const nextPage = () => flipToPage(currentPage + 1);
  const prevPage = () => flipToPage(currentPage - 1);

  // 🔥 FAST HOME (CLOSE BOOK)
  const goHome = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setFlippedPages(new Set());
    setCurrentPage(0);

    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 500); // ⬅ faster
  };

  const handleChapterSelect = (chapterIndex: number) => {
    flipToPage(chapterIndex * 2 + 1);
  };

  // Tilt only when closed
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -8, y: x * 8 });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || isAnimating) return;
    
    // Check if touch started on a scrollable element or its children
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[data-scrollable="true"]');
    
    // If touch started inside scrollable content, NEVER capture for swipe navigation
    if (scrollableContainer) {
      return; // Always let browser handle scrolling in scrollable areas
    }
    
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isOpen || isAnimating || !touchStart) return;
    
    // Check if touch is on scrollable element - if so, cancel immediately
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[data-scrollable="true"]');
    
    if (scrollableContainer) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!isOpen || isAnimating || !touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (!isVerticalSwipe) {
      if (isLeftSwipe && currentPage < totalPages - 1) {
        nextPage();
      }
      if (isRightSwipe && currentPage > 0) {
        prevPage();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape") goHome();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentPage, isAnimating]);

  const pages: Array<{
    type: "toc" | "chapter" | "shayari";
    chapterIndex?: number;
  }> = [
    { type: "toc" },
    ...chapters.flatMap((_, i) => [
      { type: "chapter" as const, chapterIndex: i },
      { type: "shayari" as const, chapterIndex: i },
    ]),
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div
        className="book-perspective w-full max-w-[800px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="book-container relative mx-auto"
          style={{
            width: "100%",
            aspectRatio: "3 / 4",
            maxHeight: "85vh",
            transform: !isOpen
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              : undefined,
            transition: !isOpen ? "transform 0.15s ease-out" : undefined,
          }}
        >
          {/* Spine Shadow */}
          <div className="absolute inset-0 bg-book-spine rounded-lg cover-shadow" />

          {/* Pages */}
          {pages.map((page, index) => {
            const isFlipped = flippedPages.has(index);
            const zIndex = totalPages - index;

            return (
              <div
                key={index}
                className={`book-page ${
                  isFlipped ? "book-page-flipped" : ""
                }`}
                style={{ zIndex }}
              >
                <div className="book-page-front">
                  {page.type === "toc" ? (
                    <TableOfContents
                      onChapterSelect={handleChapterSelect}
                    />
                  ) : page.type === "chapter" ? (
                    <BookPage
                      chapter={chapters[page.chapterIndex!]}
                      pageNumber={index}
                      totalPages={totalPages - 1}
                    />
                  ) : (
                    <BookShayariPage
                      chapter={chapters[page.chapterIndex!]}
                      pageNumber={index}
                      totalPages={totalPages - 1}
                    />
                  )}
                </div>

                <div className="book-page-back bg-book-paper rounded-r-lg page-shadow">
                  <div className="w-full h-full opacity-30 bg-gradient-to-l from-book-paper-edge to-transparent" />
                </div>
              </div>
            );
          })}

          {/* Cover */}
          <BookCover isOpen={isOpen} onOpen={handleOpen} />
        </div>
      </div>

      {/* Navigation */}
      {isOpen && (
        <div className="flex items-center gap-8 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isAnimating}
            className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 disabled:opacity-30 transition"
          >
            <ChevronLeft size={16} />
           ପୂର୍ବ ପୃଷ୍ଠା
          </button>

          <button
            onClick={goHome}
            disabled={isAnimating}
            className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition"
          >
            <Home size={16} />
            ଆରମ୍ଭ
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1 || isAnimating}
            className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100 disabled:opacity-30 transition"
          >
            ପରବର୍ତ୍ତୀ ପୃଷ୍ଠା
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Book;
