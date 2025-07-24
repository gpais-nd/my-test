import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import styles from './OverflowText.module.scss';

interface Props {
  children: string;
}

const OverflowText: FC<Props> = ({ children }) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [showViewMoreLink, setShowViewMoreLink] = useState(true);

  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTextOverflowing(isOverflowing);
    }
  }, [children]);

  const handleViewMore = (): void => {
    if (textRef && textRef.current) {
      const parentElement = textRef.current.parentElement?.parentElement;

      if (parentElement) {
        parentElement.style.height = 'fit-content';
        setShowViewMoreLink(false);
      }
    }
  };

  const getViewMoreLink = (): ReactElement => (
    <div className={styles.viewMore}>
      <span className={styles.viewMoreLink} onClick={handleViewMore}>
        View more
      </span>
    </div>
  );

  return (
    <div className={styles.overflowText}>
      <div className={styles.text} ref={textRef}>
        {children}
      </div>
      {isTextOverflowing && showViewMoreLink && getViewMoreLink()}
    </div>
  );
};

export default OverflowText;
