import { useRef, useLayoutEffect, useEffect } from 'react';

export default function useScrollComments(scrollRef, items) {
  const compensateScroll = useRef();
  const keepToBottom = useRef(true);
  const firstCommentIdRef = useRef();

  if (scrollRef.current) {
    const el = scrollRef.current;
    compensateScroll.current = null;
    keepToBottom.current = el.scrollHeight - el.clientHeight <= el.scrollTop;
    if (
      firstCommentIdRef.current &&
      firstCommentIdRef.current !== items[items.length - 1].comment_id
    ) {
      compensateScroll.current = {
        height: el.scrollHeight,
        scrollTop: el.scrollTop
      };
    }
  }

  useEffect(() => {
    if (items && items.length) {
      firstCommentIdRef.current = items[items.length - 1].comment_id;
    }
  });

  useLayoutEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      if (compensateScroll.current) {
        el.scrollTop =
          compensateScroll.current.scrollTop +
          (el.scrollHeight - compensateScroll.current.height);
      } else if (keepToBottom.current) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      }
    }
  });
}
