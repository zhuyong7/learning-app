import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface SharedButtonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type NativeButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorButtonProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = NativeButtonProps | AnchorButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-growth-primary text-white shadow-lg shadow-green-300/40 hover:-translate-y-0.5 hover:bg-green-400 focus-visible:outline-growth-primary',
  secondary:
    'bg-white text-growth-ink shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-growth-secondary',
  ghost:
    'bg-transparent text-slate-600 hover:bg-white/70 hover:text-growth-ink focus-visible:outline-growth-secondary',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', className, children } = props;
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    className,
  );

  if (props.href) {
    const anchorOnlyProps = props as AnchorButtonProps;
    const { variant: _variant, className: _className, children: _children, ...anchorProps } = anchorOnlyProps;

    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonOnlyProps = props as NativeButtonProps;
  const { variant: _variant, className: _className, children: _children, ...buttonProps } = buttonOnlyProps;

  return (
    <button className={classes} type={buttonProps.type ?? 'button'} {...buttonProps}>
      {children}
    </button>
  );
}
