import { InputHTMLAttributes } from "react";
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}
export default function Input({id, name, className ,...rest}:InputProps){

    return <input 
         id={id}
         name= {name}
         className={clsx("w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900", className)}
         {...rest}
         />
}