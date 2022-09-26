declare namespace BaseTypes {
  type TDimensions =
    | {
        width: number;
        height: number;
        margin: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
      }
    | undefined;
}
