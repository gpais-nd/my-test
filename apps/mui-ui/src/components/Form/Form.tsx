import { ReactNode } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import styles from './Form.module.scss';

interface Props {
  children: ReactNode;
  id: string;
  onSubmit: SubmitHandler<FieldValues>;
  ariaLabel?: string;
  displayColumns?: boolean;
  className?: string;
}

const Form = ({
  children,
  id,
  onSubmit,
  ariaLabel,
  displayColumns = false,
  className,
}: Props) => {
  const methods = useForm<FieldValues>();

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={`${className} ${
          displayColumns ? styles.formColumnsLayout : ''
        }`}
        onSubmit={methods.handleSubmit(onSubmit)}
        aria-label={ariaLabel ?? 'form'}
        role="form"
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
