export interface Position {
  id: number;
  name: string;
  description?: string;
  parentid?: number | null;
  children?: Position[];
}

export interface formData {
  name: string;
  description: string;
  parentid: number | null;
}
