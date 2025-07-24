import { ReactElement } from 'react';

export interface Option {
  value: string;
  label: string | ReactElement;
}

export interface CountingOption extends Option {
  count: number;
}

export interface FormValues {
  [key: string]: string | CountingOption;
}
