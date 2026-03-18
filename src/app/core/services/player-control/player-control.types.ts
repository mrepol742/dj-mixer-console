export interface Metadata {
  tags: {
    title?: string;
    artist?: string;
    album?: string;
    picture?: {
      data: number[];
      format: string;
    };
  };
}

export interface MetadataResult {
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
}
