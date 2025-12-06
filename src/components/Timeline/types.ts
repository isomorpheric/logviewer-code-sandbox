export interface TimeBucket {
  start: number;
  end: number;
}

export interface BucketedData {
  bucket: TimeBucket;
  count: number;
}

export interface TimeRange {
  min: number;
  max: number;
}
