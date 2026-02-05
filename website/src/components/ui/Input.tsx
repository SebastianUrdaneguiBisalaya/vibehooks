import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

function BaseInput({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				'w-full font-reddit-sans focus:outline-none text-sm transition-colors duration-500 ease-in-out px-4 py-1.5 rounded-lg',
				className
			)}
			{...props}
		/>
	);
}

function Primary(props: InputProps) {
	return (
		<BaseInput
			{...props}
			className={cn('border border-white/20 text-white-100', props.className)}
		/>
	);
}

export const Input = Object.assign(BaseInput, {
	Primary,
});
