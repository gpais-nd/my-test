import { ReactElement } from 'react';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id?: number;
  content: ReactElement | string;
  variant: ToastVariant;
  timeout?: number;
}
