// Fix for React 18 TypeScript compatibility issues
declare module 'react' {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {}
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
  }
}

// Fix ForwardRef issues
declare global {
  namespace React {
    interface ReactPortal {
      key: Key | null;
      children: ReactNode;
    }
  }
}

export {};