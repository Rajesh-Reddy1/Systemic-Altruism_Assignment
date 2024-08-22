import React, { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react'

// Button Component
export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Input Component
export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <input 
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Label Component
export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <label 
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

// Textarea Component
export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <textarea 
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}