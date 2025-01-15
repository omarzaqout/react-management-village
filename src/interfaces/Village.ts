export interface Village {
  id: number;
  name: string;
  region: string;
  landArea: string;
  latitude: string;
  longitude: string;
  image:string;
  CategoriesTags: string;
  [key: string]: string | number; 
}
export interface VillageItemProps {
    id: number;
    name: string;
    region: string;
    onAction: (action: string, id: number) => void;
  }
  export interface PopupProps {
    title: string;
    inputs: { label: string; type?: string; value?: string; placeholder?: string; disabled?: boolean }[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: string[], id?: number) => void; // إضافة id كمعامل اختياري
    id?: number; // حقل اختياري لتمرير selectedVillageId
  }
  
  export interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?:string;
    disabled?:boolean;
  }