declare module '*.html' {
    var _: string;
    export default  _;
}

declare module '*.css' {
    var _: string;
    export default  _;
}

declare function ga(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any): void;
declare function fbq(arg1: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any): void;

// customs

declare type ScrollDirection = 'TOP' | 'DOWN';

declare type VoidMethod = () => void;