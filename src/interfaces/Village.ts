export interface Village {
    id: number;
    name: string;
    region: string;
  }
export interface VillageItemProps {
    id: number;
    name: string;
    region: string;
    onAction: (action: string, id: number) => void;
  }