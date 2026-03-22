export interface Metadata {
  tags: {
    title?: string;
    artist?: string;
    album?: string;
    bpm?: number;
    picture?: {
      data: number[];
      format: string;
    };
  };
}

export interface Library {
  id: string;
  title: string;
  artist: string;
  album: string;
  bpm: number | null;
  filename: string;
  cover_url: string | null;
  url: string;
  created_at: Date;
}
