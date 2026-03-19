declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.jpg';

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.ico' {
    const content: string;
    export default content;
}
