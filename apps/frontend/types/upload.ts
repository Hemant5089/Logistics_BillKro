export interface UploadJob {
  id: number;
  progress: number;
  finishedOn: number | null;
  processedOn: number | null;
  failedReason: string | null;
  attemptsMade: number;
}