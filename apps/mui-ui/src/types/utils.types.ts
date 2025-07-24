export interface GenericTypeWithId {
  id: string;
}

export interface GenericTypeWithValue {
  value: string;
}

export interface Error {
  title?: string;
  code?: string;
  message: string;
}

export interface Link {
  text: string;
  href: string;
}

export type CSSSizeValue =
  | number
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | `${number}vh`
  | 'auto'
  | 'inherit'
  | 'initial'
  | 'unset';
