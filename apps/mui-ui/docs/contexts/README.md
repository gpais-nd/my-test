## Usage & Typing

```typescript
// This interface tells our application what will be returned by useContext
export interface ContextState {
  counter: number;
  handleCounterChange: (amount: number) => void;
}

const initialState = {
  counter: 0,
  handleCounterChange: () => {},
};

export const ExampleContext = createContext<ContextState>(initialState);

export const ExampleProvider: React.FC<{}> = ({children}) => {
  const [counter, setCounter] = useState(0);

  const handleCounterChange = (amount: number) => {
    setCounter(currentCount => {
      return amount + currentCount;
    });
  };

  return (
    <ExampleContext.Provider
      value={{
        counter,
        handleCounterChange,
      }}
    >
      {children}
    </ExampleContext.Provider>
  );
};

export default TreeProvider;
```

Then we can access to the context state by any children component like this:

```typescript
const {counter, setCounter} = useContext(ExampleContext);
```
