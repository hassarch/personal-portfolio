# TypingEffect Component

A reusable React component that displays text character-by-character with a typing animation effect, designed for terminal-style interfaces.

## Features

- ✅ Character-by-character typing animation
- ✅ Configurable typing speed
- ✅ Blinking cursor element
- ✅ Completion callbacks
- ✅ Automatic text reset when prop changes
- ✅ Clean interval cleanup on unmount

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | (required) | The text to display with typing effect |
| `speed` | `number` | `30` | Milliseconds per character |
| `onComplete` | `() => void` | `undefined` | Callback fired when typing completes |
| `showCursor` | `boolean` | `true` | Whether to show blinking cursor |

## Usage

### Basic Usage

```tsx
import TypingEffect from './components/TypingEffect';

function Example() {
  return <TypingEffect text="Hello, World!" />;
}
```

### Custom Speed

```tsx
<TypingEffect 
  text="Typing slowly..." 
  speed={50} 
/>
```

### Fast Typing

```tsx
<TypingEffect 
  text="Quick output" 
  speed={20} 
/>
```

### With Completion Callback

```tsx
function BootSequence() {
  const [step, setStep] = useState(0);
  
  return (
    <>
      {step === 0 && (
        <TypingEffect 
          text="Initializing system..." 
          onComplete={() => setStep(1)} 
        />
      )}
      {step === 1 && (
        <TypingEffect 
          text="Loading modules..." 
          onComplete={() => setStep(2)} 
        />
      )}
    </>
  );
}
```

### Hide Cursor

```tsx
<TypingEffect 
  text="No cursor here" 
  showCursor={false} 
/>
```

### Terminal Command Output

```tsx
function CommandOutput({ output }: { output: string }) {
  return (
    <div className="terminal-output">
      <span className="text-terminal-green">$ </span>
      <TypingEffect text={output} speed={20} />
    </div>
  );
}
```

## Styling

The component uses the following CSS classes:

- `.typing-text` - Container for the typed text
- `.terminal-cursor` - Blinking cursor element
- `.animate-blink` - Animation class for cursor (defined in global CSS)

## Speed Reference

Based on the design document:

- **Fast (20ms)**: Command output
- **Normal (30ms)**: Default speed
- **Slow (50ms)**: Boot sequence messages

## Requirements Satisfied

This component satisfies the following requirements:

- **2.2**: Boot sequence typing effect
- **3.9**: Command output typing animation  
- **7.4**: Typing effect for terminal outputs

## Testing

The component includes comprehensive unit tests covering:
- Text rendering character-by-character
- Custom speed configuration
- Completion callbacks
- Cursor visibility
- Text prop changes
- Empty strings and edge cases
- Cleanup on unmount

Run tests with:
```bash
npm test -- TypingEffect
```
