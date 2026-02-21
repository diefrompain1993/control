import { useCallback, useEffect, useRef, type RefObject } from 'react';

type SavedPageScroll = {
  top: number;
  stickBottom: boolean;
};

interface UsePaginatedPageScrollParams {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hostRef: RefObject<HTMLElement | null>;
}

export const usePaginatedPageScroll = ({
  currentPage,
  setCurrentPage,
  hostRef
}: UsePaginatedPageScrollParams) => {
  const pageScrollByPageRef = useRef<Record<number, SavedPageScroll>>({});

  const getMainScrollContainer = useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;
    return host.closest('main') as HTMLElement | null;
  }, [hostRef]);

  const rememberCurrentPageScroll = useCallback(
    (page: number) => {
      const container = getMainScrollContainer();
      if (!container) return;
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const top = container.scrollTop;
      pageScrollByPageRef.current[page] = {
        top,
        stickBottom: maxScrollTop - top <= 8
      };
    },
    [getMainScrollContainer]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage === currentPage) return;
      rememberCurrentPageScroll(currentPage);
      setCurrentPage(nextPage);
    },
    [currentPage, rememberCurrentPageScroll, setCurrentPage]
  );

  const resetPageScrollMemory = useCallback(() => {
    pageScrollByPageRef.current = {};
  }, []);

  useEffect(() => {
    const container = getMainScrollContainer();
    const saved = pageScrollByPageRef.current[currentPage];
    if (!container || !saved) return;

    let rafA = 0;
    let rafB = 0;
    const restore = () => {
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const targetTop = saved.stickBottom ? maxScrollTop : Math.min(saved.top, maxScrollTop);
      container.scrollTo({ top: targetTop, behavior: 'auto' });
    };

    rafA = window.requestAnimationFrame(() => {
      restore();
      rafB = window.requestAnimationFrame(restore);
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [currentPage, getMainScrollContainer]);

  return {
    handlePageChange,
    resetPageScrollMemory,
    rememberCurrentPageScroll
  };
};
