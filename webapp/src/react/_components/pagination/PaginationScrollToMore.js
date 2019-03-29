import React, { useEffect, useRef } from 'react';
import { styleSheet } from 'swiss-react';
import useLoader from 'src/react/_hooks/useLoader';
import Loader from 'src/react/_components/loaders/Loader';
import Button from 'src/react/_components/Button/Button';

const SW = styleSheet('PaginationScrollToMore', {
  Wrapper: {},
  LoadWrapper: {
    padding: '12px',
    _flex: ['row', 'left', 'center']
  },
  LoadLabel: {
    paddingLeft: '12px'
  },
  ErrorLabel: {
    // color: '$red',
    paddingRight: '12px'
  }
});

export default function PaginationScrollToMore({ req, errorLabel }) {
  const loader = useLoader();
  const wrapperRef = useRef();
  const checkMoreRef = useRef();

  const handleReload = () => {
    loader.clear('more');
    checkMoreRef.current();
  };

  const isElementOnScreen = () => {
    if (!wrapperRef.current) {
      return false;
    }
    const rect = wrapperRef.current.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const checkForMore = async () => {
    if (!req.result || !req.hasMore) {
      return;
    }
    if (loader.check('more') || loader.get('more').error) {
      return;
    }
    if (isElementOnScreen()) {
      loader.set('more');

      const res = await req.fetchNext();
      // console.log(res);
      if (!res || res.ok) {
        loader.clear('more');
      } else {
        loader.error('more', res.error);
      }
    }
  };
  useEffect(() => {
    checkMoreRef.current = checkForMore;
    checkMoreRef.current();
  });
  useEffect(() => {
    const check = () => checkMoreRef.current();
    document.addEventListener('scroll', check, true);
    return () => {
      document.removeEventListener('scroll', check);
    };
  }, []);

  return (
    <SW.Wrapper innerRef={e => (wrapperRef.current = e)}>
      {loader.check('more') && (
        <SW.LoadWrapper>
          <Loader mini size={30} />
          <SW.LoadLabel>Loading...</SW.LoadLabel>
        </SW.LoadWrapper>
      )}
      {loader.get('more').error && (
        <SW.LoadWrapper>
          <SW.ErrorLabel>
            {errorLabel || loader.get('more').error}
          </SW.ErrorLabel>
          <Button icon="Reload" onClick={handleReload} />
        </SW.LoadWrapper>
      )}
    </SW.Wrapper>
  );
}
