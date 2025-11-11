import './react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      button: any;
      input: any;
      form: any;
      label: any;
      span: any;
      [key: string]: any;
    }
  }
}

export {};
