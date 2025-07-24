import { ChangeEvent, FC, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import styles from './GlossaryMetadata.module.scss';
import { Attribute } from 'types/entities.types';
import { getGlossaryContent } from './glossary';
import { Button, ButtonGroup, Box, Alert } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface Props {
  data?: Attribute[];
  searchTerm?: string;
  selectedLetter?: string;
}
const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
);
const GlossaryMetadata: FC<Props> = ({
  data,
  searchTerm,
  selectedLetter = 'A',
}) => {
  const [items, setItems] = useState<Attribute[]>([]);
  const [glosaryLetter, setGlossaryLetter] = useState<string>(selectedLetter);
  const searchItem = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItems(
      data?.filter(item =>
        item.label.toLowerCase().includes(event.target.value.toLowerCase())
      ) ?? []
    );
    setGlossaryLetter('');
  };

  useEffect(() => {
    if (searchTerm) {
      setItems(
        data?.filter(item =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        ) ?? []
      );
      setGlossaryLetter('');
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedLetter) {
      setItems(
        data?.filter(item =>
          item.label.toLowerCase().includes(selectedLetter.toLowerCase())
        ) ?? []
      );
    }
  }, [selectedLetter]);

  const filterItems = (key: string) => {
    setItems(
      data?.filter(item =>
        item.label.toLowerCase().startsWith(key.toLowerCase())
      ) ?? []
    );
    setGlossaryLetter(key);
  };

  return (
    <div className={styles.glossaryMetadata}>
      <TextField
        id="glossary-letters"
        label="Search term"
        variant="outlined"
        className={styles.searchMetadata}
        onChange={searchItem}
        defaultValue={searchTerm}
      />
      <Box className={styles.abc}>
        <ButtonGroup size="medium" aria-label="Glossary Metadata">
          {letters.map(letter => (
            <Button
              onClick={() => filterItems(letter)}
              variant={letter === glosaryLetter ? 'contained' : 'outlined'}
              className={styles.letterButton}
              key={letter}
            >
              {letter}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <div className={styles.glossaryContent}>
        {items.length === 0 && (
          <Alert severity="info">No glossary items found</Alert>
        )}
        {items?.map((item: Attribute) => (
          <div className={styles.glossaryItem} key={item.label}>
            <div className={styles.bookmark}>
              <BookmarkBorderIcon />
            </div>
            <div className={styles.glossaryData}>
              <h4>{item.label}</h4>
              <p>{item.description ?? getGlossaryContent(item.label)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossaryMetadata;
