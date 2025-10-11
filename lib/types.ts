export type UploadDoc = {
  id?: string;
  ownerId: string;
  fileName: string;
  size: number;
  contentType: string | null;
  storagePath: string;
  downloadURL: string;
  uploadedAt: any; // Firestore Timestamp
};
