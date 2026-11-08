export interface ZabbixItem {
  id: string;
  name: string;
  key: string;
  type: string; // 'агент' | 'internal' | 'зависимый'
  interval: string;
  status: 'active' | 'disabled';
  note: string;
  hasTrigger?: boolean;
  triggerNote?: string;
  isMaster?: boolean;
  isGroup?: boolean;
  groupName?: string;
}

export interface ItemGroup {
  id: string;
  name: string;
  items: ZabbixItem[];
}

export type SectionType = 'template' | 'prototype';

export interface Section {
  id: SectionType;
  title: string;
  groups: ItemGroup[];
}
