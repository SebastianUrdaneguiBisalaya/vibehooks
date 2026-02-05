import {
	Info,
	Lightbulb,
	MessageSquareWarning,
	TriangleAlert,
	OctagonAlert,
} from 'lucide-react';

import { cn } from '@/lib/cn';

export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
	className?: string;
}

export interface BlockquoteContentProps extends React.HTMLAttributes<HTMLSpanElement> {
	className?: string;
}

const BaseBlockquote = ({ className, ...props }: BlockquoteProps) => {
	return (
		<blockquote
			className={cn(
				'w-full flex flex-col items-start gap-1.5 border-l-3 p-3 my-2',
				className
			)}
			{...props}
		>
			{props.children}
		</blockquote>
	);
};

const BlockquoteContent = ({ className, ...props }: BlockquoteContentProps) => {
	return (
		<span
			className={cn('font-reddit-sans text-sm text-white/80', className)}
			{...props}
		>
			{props.children}
		</span>
	);
};

const BlockquoteTitle = ({ className, ...props }: BlockquoteContentProps) => {
	return (
		<span
			className={cn(
				'text-sm font-reddit-sans font-medium capitalize text-white/90',
				className
			)}
			{...props}
		>
			{props.children}
		</span>
	);
};

const Note = ({ className, ...props }: BlockquoteProps) => {
	return (
		<BaseBlockquote className={cn('border-l-blue-500', className)} {...props}>
			<div className='flex flex-row items-center gap-1.5'>
				<Info className='text-blue-500' size={14} />
				<BlockquoteTitle className='text-blue-500'>Note</BlockquoteTitle>
			</div>
			{props.children}
		</BaseBlockquote>
	);
};

const Tip = ({ className, ...props }: BlockquoteProps) => {
	return (
		<BaseBlockquote className={cn('border-l-green-500', className)} {...props}>
			<div className='flex flex-row items-center gap-1.5'>
				<Lightbulb className='text-green-500' size={14} />
				<BlockquoteTitle className='text-green-500'>Tip</BlockquoteTitle>
			</div>
			{props.children}
		</BaseBlockquote>
	);
};

const Important = ({ className, ...props }: BlockquoteProps) => {
	return (
		<BaseBlockquote className={cn('border-l-purple-500', className)} {...props}>
			<div className='flex flex-row items-center gap-1.5'>
				<MessageSquareWarning className='text-purple-500' size={14} />
				<BlockquoteTitle className='text-purple-500'>Important</BlockquoteTitle>
			</div>
			{props.children}
		</BaseBlockquote>
	);
};

const Warning = ({ className, ...props }: BlockquoteProps) => {
	return (
		<BaseBlockquote className={cn('border-l-amber-500', className)} {...props}>
			<div className='flex flex-row items-center gap-1.5'>
				<TriangleAlert className='text-amber-500' size={14} />
				<BlockquoteTitle className='text-amber-500'>Warning</BlockquoteTitle>
			</div>
			{props.children}
		</BaseBlockquote>
	);
};

const Caution = ({ className, ...props }: BlockquoteProps) => {
	return (
		<BaseBlockquote className={cn('border-l-red-500', className)} {...props}>
			<div className='flex flex-row items-center gap-1.5'>
				<OctagonAlert className='text-red-500' size={14} />
				<BlockquoteTitle className='text-red-500'>Caution</BlockquoteTitle>
			</div>
			{props.children}
		</BaseBlockquote>
	);
};

export const Blockquote = Object.assign(BaseBlockquote, {
	Caution,
	Content: BlockquoteContent,
	Important,
	Note,
	Tip,
	Warning,
});
