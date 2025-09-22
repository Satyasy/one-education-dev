export interface DropdownState {
  [key: number]: boolean;
}

export interface NotesState {
  [key: number]: string;
}

export interface CurrentEditingItem {
  id: number;
  name: string;
  note: string;
}

export interface CurrentHistoryItem {
  id: number;
  name: string;
  histories: any[];
} 