import { FC } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  text: string;
  url: string;
  shouldOpenInNewTab?: boolean;
}

const AssetRowCustomLink: FC<Props> = ({
  text,
  url,
  shouldOpenInNewTab = true,
}) => {
  return (
    <Link
      to={url}
      target={shouldOpenInNewTab ? '_blank' : undefined}
      rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
    >
      {text}
    </Link>
  );
};

export default AssetRowCustomLink;
