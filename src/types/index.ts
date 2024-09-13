type CssProperty = keyof Omit<
  CSSStyleDeclaration,
  | "item"
  | "setProperty"
  | "removeProperty"
  | "getPropertyValue"
  | "getPropertyPriority"
  | "parentRule"
  | "length"
  | "cssFloat"
  | "cssText"
  | typeof Symbol.iterator
  | number
>;

type CSSProperties = {
  [key in CssProperty]?: string | number | undefined;
};

export interface IBaseProps {
  id?: string;
  name?: string;
  style?: string | CSSProperties | null | undefined;
}

export interface IAnimateProps extends IBaseProps {
  animate?: "slide" | "fade" | "none" | "initial";
}
export interface IClassNameProps extends IBaseProps {
  className?: string;
}
