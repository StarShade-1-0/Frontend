declare module 'react' {
  interface ReactPortal {
    key: Key | null;
    children: ReactNode;
    type: any;
    props: any;
  }
}

export {};
