import { cn } from '@/lib/cn';

export interface LayoutRootProps {
	children: React.ReactNode;
	className?: string;
}

export interface LayoutTitletProps {
	children: React.ReactNode;
	className?: string;
}

export interface LayoutContentProps {
	children: React.ReactNode;
	className?: string;
}

const RootLayout = ({ children, className }: LayoutRootProps) => {
	return (
		<div
			className={cn(
				'w-full mx-auto flex flex-col items-center gap-4 px-4 py-8 rounded-lg shadow-md border border-white/20',
				className
			)}
		>
			{children}
		</div>
	);
};

const LayoutTitle = ({ children, className }: LayoutTitletProps) => {
	return (
		<h3
			className={cn(
				'w-full text-center text-white/90 font-sora font-semibold',
				className
			)}
		>
			{children}
		</h3>
	);
};

const LayoutContent = ({ children, className }: LayoutContentProps) => {
	return (
		<div className={cn('w-full flex flex-col items-center', className)}>
			{children}
		</div>
	);
};

const LayoutCaptionContent = ({ children, className }: LayoutContentProps) => {
	return (
		<span
			className={cn(
				'font-reddit-sans text-xs text-white/60 w-full text-center',
				className
			)}
		>
			{children}
		</span>
	);
};

const LayoutErrorContent = ({ children, className }: LayoutContentProps) => {
	return (
		<span
			className={cn(
				'font-reddit-sans text-xs text-red-500 w-full text-center',
				className
			)}
		>
			{children}
		</span>
	);
};

const LayoutContentParagraph = ({
	children,
	className,
}: LayoutContentProps) => {
	return (
		<p
			className={cn(
				'font-reddit-sans text-sm text-white w-full text-center',
				className
			)}
		>
			{children}
		</p>
	);
};

const LayoutContentLoading = () => {
	return (
		<div className='flex w-full max-w-lg flex-row items-center justify-center rounded-lg border border-white/20 bg-neutral-900 p-4 shadow-md'>
			<div className='relative flex items-center'>
				<div className='h-5 w-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin' />
			</div>
			<h3 className='pl-4 font-sora text-center font-medium text-white/60'>
				This component is loading.
			</h3>
		</div>
	);
};

const LayoutContentNotSupported = ({
	children,
	className,
}: LayoutContentProps) => {
	return <Layout.Title className={className}>{children}</Layout.Title>;
};

export const Layout = Object.assign(RootLayout, {
	Caption: LayoutCaptionContent,
	Content: LayoutContent,
	ContentLoading: LayoutContentLoading,
	ContentNotSupported: LayoutContentNotSupported,
	Error: LayoutErrorContent,
	Paragraph: LayoutContentParagraph,
	Title: LayoutTitle,
});
