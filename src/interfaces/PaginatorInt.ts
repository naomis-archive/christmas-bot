export interface Paginator {
  pageForward: () => Page;
  pageBackward: () => Page;
}

export interface Page {
  content: string;
  footer: string;
}
