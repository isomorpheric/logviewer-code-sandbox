# Timeline Component

> [!IMPORTANT]
> In a real production application, I would have likely leaned on a charting library for the rendering. The logic to create the buckets would require only minimal refactor, if any.

Bar chart showing log event distribution over time.

## Usage

```tsx
<Timeline logs={logs} bucketCount={8} height={120} />
```

## How It Works

```
logs → getTimeRange() → createTimeBuckets() → assignLogsToBuckets() → render bars
```

1. Extract min/max timestamps from logs
2. Divide time range into equal buckets
3. Count logs per bucket
4. Render bars scaled to max count

## Pure Functions (exported for testing)

- `getTimeRange()` - Extract min/max timestamps
- `createTimeBuckets()` - Generate evenly-spaced time intervals
- `assignLogsToBuckets()` - Count logs per bucket
- `calculateYAxisTicks()` - Generate axis labels
- `formatAxisTime()` - Format timestamps as `YYYY-MM-DD HH:MM:SS`