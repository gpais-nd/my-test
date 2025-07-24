import { FC, ReactElement } from 'react';
import { isSafariBrowser } from '../../../utils';

interface Props {
  children: ReactElement;
}

const SafariWrapper: FC<Props> = ({ children }) => {
  const isSafari = isSafariBrowser();

  return isSafari ? (
    // @ts-ignore: this body tag is added because Safari doesn't show nodes properly
    // and displace them to the origin of the SVG. Please refer to this issue:
    // https://github.com/bkrem/react-d3-tree/issues/284 where the options are to
    // disable transform and transition functions, not able to do in this app due
    // it is required for pan and zoom events.
    <body xmlns="http://www.w3.org/1999/xhtml">{children}</body>
  ) : (
    <>{children}</>
  );
};

export default SafariWrapper;
