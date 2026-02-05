import { cn } from '@/lib/cn';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

function BaseTag({ children, className, ...props }: TagProps) {
	return (
		<span
			className={cn(
				'px-2 py-0.5 rounded-2xl whitespace-nowrap shrink-0 w-fit flex flex-row items-center gap-1.5 font-reddit-sans text-xs text-white/80',
				className
			)}
			{...props}
		>
			{children}
		</span>
	);
}

function Loading({ children, className, ...props }: TagProps) {
	return (
		<BaseTag
			className={cn(
				'bg-neutral-800 border border-transparent text-white-100',
				className
			)}
			{...props}
		>
			<div className='relative flex items-center'>
				<div className='h-3 w-3 rounded-full border-2 border-white-100 border-t-transparent animate-spin' />
			</div>
			{children}
		</BaseTag>
	);
}

function Primary({ children, className, ...props }: TagProps) {
	return (
		<BaseTag className={cn('bg-neutral-800', className)} {...props}>
			<strong>{children}</strong>
		</BaseTag>
	);
}

export const Tag = Object.assign(BaseTag, {
	Loading,
	Primary,
});
