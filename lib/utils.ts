import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export const cn = (...classes: ClassValue[]) => {
    console.log(twMerge(clsx(classes)));
    
    return twMerge(clsx(classes));
}