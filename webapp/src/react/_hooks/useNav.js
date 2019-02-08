import { useContext } from 'react';
import { NavContext } from 'src/react/_hocs/Nav/NavProvider';

export default function useNav() {
  return useContext(NavContext);
}
