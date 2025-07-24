# Form Creation

This document will guide you on how we are creating and managing forms inside the project.

## React Hook Form + Yup

We are using the libraries libraries [react-hook-form](https://react-hook-form.com/) and [yup](https://github.com/jquense/yup) to handle form states and form validation, the combination of this two libraries allows us to create simple and complex forms without investing too much time.

## Simple Usage

React-hook-form exposes a `useForm` hook that returns everything we need to
build the form, from onChange handlers to validations.

```ts
import {useForm} from 'react-hook-form';

export interface ExampleFormData {
  username: string;
  password: string;
}

function App() {
  const form = useForm<ExampleFormData>({
    defaultValues: {},
    mode: 'all',
  });

  return (
    <form>
      <input {...form.register('username')} />
      <input {...form.register('password')} type="password" />
    </form>
  );
}
```

You might be thinking, what is happening here? Simple, the `register `function receives the name of the property it will be responsible to handle, for example, in the first input we are going to get the value for `username`, so we call `form.register` with the string `username` as an argument and destruct the return value as inferred props to the input.

In the background, `form.register` returns 4 things:

- onBlur
- onChange
- ref
- name

This means that with one simple call to the register functionality we will have the input ready to handle value changes and save it to the form instance.

## Validations

Now that we have our form ready to handle input changes, we also want to validate those entries, to do so we will use a powerful combination, `react-hook-form` + `yup`.

Yup is a schema validation library, we are going to use a resolver to cast the schema validation into a react-hook-form resolver, by doing this we will have an automatic validation of our inputs running based on the `mode` property we pass to the `useForm` instance.

```ts
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

export const exampleValidationSchema = yup.object().shape({
  username: yup.string().email(),
  password: yup.string().required().max(16).min(8),
});

export interface ExampleFormData {
  username: string;
  password: string;
}

function App() {
  const form = useForm<ExampleFormData>({
    defaultValues: {},
    mode: 'all',
    resolver: yupResolver(exampleValidationSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(formData => console.log(formData))}>
      <input {...form.register('username')} />
      <input {...form.register('password')} type="password" />
      <button type="submit" />
    </form>
  );
}
```

Just by creating a schema and casting it to a resolver we are going to have a fully built-in validation, every time an input changes or is blurred the validation will run by default, for example if the user starts typing the password and only enters 6 characters, when blurring the input the form will become invalid. If a form is invalid it will not be allowed to be submitted by default, this means that if user hits submit and validations do not pass, the submitCallback will not be called.

### How do we inform the user that an error is present?

The form instance has a property called `formState` inside this property you have a lot of fields, you can see a complete list of those [here](https://react-hook-form.com/api/useform/formstate).

In order to render the error message, we will use the following procedure:

```ts
<form onSubmit={form.handleSubmit(formData => console.log(formData))}>
  <input {...form.register('username')} />
  <span>
    {form.formState.errors.username && form.formState.errors.username.message}
  </span>
  <input {...form.register('password')} type="password" />
  <span>
    {form.formState.errors.password && form.formState.errors.password.message}
  </span>
  <button type="submit" disabled={formState.isValid} />
</form>
```

With the above code, if an error is present we will show it's message inside the `span` element.

## Controllers & Trek Examples

Some Trek data inputs won't work seamlessly with the `form.register` function, in some cases when working with more complex fields we will need to use the `<Controller />` component.
A controller is a component the react-hook-form provides us to customize the onChange callbacks and value rendering.

### Example with field that supports register

```ts
<TextField
  disabled
  placeholder={'Subject Line Goes Here'}
  label="Subject"
  {...register('subject')}
/>
```

### Example with field that does NOT support register

```ts
<Controller
  name="language"
  control={control}
  render={({field}) => {
    return (
      <DropDown
        errMsg={formState.errors?.language?.message || ''}
        label="Language"
        value={field.value}
        onChange={value => field.onChange(value)}
        disabled
      >
        <DropDownItem value={Languages.enUS}>en-US</DropDownItem>
      </DropDown>
    );
  }}
/>
```

## Extra Documentation

This was a brief overview of the most use cases we are covering in the application, however for a better understanding you should read the following docs:

- [useForm](https://react-hook-form.com/api/useform)
- [useFormContext](https://react-hook-form.com/api/useformcontext)
- [useFieldArray](https://react-hook-form.com/api/usefieldarray) - useful when number of inputs is dynamic
- [Yup](https://github.com/jquense/yup)
- [React Hook Form TS](https://react-hook-form.com/ts)
