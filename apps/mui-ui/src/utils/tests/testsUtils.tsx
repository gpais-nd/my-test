import { FC, ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface ReactHookFormWrapperProps {
  component: ReactElement;
}

export const ReactHookFormWrapper: FC<ReactHookFormWrapperProps> = ({
  component,
}) => {
  const methods = useForm();

  return <FormProvider {...methods}>{component}</FormProvider>;
};
