
declare interface IIdenticon {
    toString: () => string;
}

declare interface IIdenticonOptions {
    background?: Array<number>;
    margin?: number;
    size?: number;
}

declare module 'identicon' {
    export default class Identicon implements IIdenticon {
        public toString: () => string;
        public constructor(hash: string, options: IIdenticonOptions);
    }
}