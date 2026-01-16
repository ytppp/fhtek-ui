// IP 类型定义
export type IPType = 'IPv4' | 'IPv6' | 'mix';

// 网络数据格式定义
export interface NetworkData {
  value: string;
  unit: string;
}

// 文件类型定义
export interface File {
  name: string;
}

// 导出的常量
export declare const specialChar: string;
export declare const invalidChar: string;

// 函数声明
export declare function getLangUsed(lang?: string): string | null;
export declare function scrollTo(el: HTMLElement, x?: number, y?: number): void;
export declare function getIpBefore(ip: string): string;
export declare function getIpAfter(ip: string): string;
export declare function mergeOptions<T, U>(opt1: T, opt2: U): T & U;
export declare function isObjArrHasVal<T extends Record<string, any>>(arr: T[], val: any, childNodeName?: string, keyName?: string): boolean;
export declare function isMobileDevice(width?: number): boolean;
export declare function setFavicon(favicon: string): void;
export declare function setDocTitle(title: string): void;
export declare function getPublicFile(url: string): string;
export declare function isValidLength(value: string, min?: number, max?: number): boolean;
export declare function isValidSymbol(value: string, ruleReg?: RegExp): boolean;
export declare function isInvalidSymbol(value: string, ruleReg?: RegExp): boolean;
export declare function getStringByte(str: string): number;
export declare function getFileExtendName(file?: File): string;
export declare function isIP(ip?: string, type?: IPType): boolean;
export declare function ip2int(ip: string): number;
export declare function isMulticast(ip: string): boolean;
export declare function isLoopback(ip: string): boolean;
export declare function isPrivateIP(ip: string): boolean;
export declare function isNetworkIP(ip: string, mask?: string): boolean;
export declare function isBoardcastIP(ip: string, mask?: string): boolean;
export declare const isValidGatewayIP: (ip: string, mask: string) => boolean;
export declare function getSubNetwork(hostIP: string, mask: string): number;
export declare const format: (str: string, args: any[]) => string;
export declare function isValidDns(value: string): boolean;
export declare function isValidMask(ip: string): boolean;
export declare function isValidNameEx(name: string): boolean;
export declare function validationCharacterRange(val: string, minLen?: number, maxLen?: number): boolean;
export declare function tranSimIpv6ToFullIpv6(simpeIpv6: string): string;
export declare function isValidIpv6AddrExtra(value: string): boolean;
export declare function isValidIpv6Dns(value: string): boolean;
export declare const isReal: (value: any) => boolean;
export declare function isValidInteger(value: any, min?: number, max?: number): boolean;
export declare function isValidVal(val: string, minLen?: number, maxLen?: number): boolean;
export declare function isValidName(name: string): boolean;
export declare function isObjExistVal<T extends Record<string, any>>(obj: T, val: any): boolean;
export declare function isValidDomain(value: string, flag?: boolean): boolean;
export declare const isMac: (mac: string) => boolean;
export declare function isValidUrlName(url: string): boolean;
export declare function isValidUnixPath(path: string): boolean;
export declare const formatDuration: (value: number) => number[];
export declare function cidrToSubnetMask(prefixLength: number): string | false;
export declare const formatNetworkData: (value: number) => NetworkData;
export declare const handleLogout: (isLogout?: boolean) => void;
export declare const successTips: (msg?: string) => void;
export declare const search: <T extends string[][]>(database: T, searchVal: string) => T;
export declare const findObjectsWithValue: <T extends Record<string, any>>(database: T[], searchVal: any) => T[];
export declare function isValidStaticRouteMask(ip: string, mask: string): boolean;
export declare function isHexadecimal(input: any): boolean;
