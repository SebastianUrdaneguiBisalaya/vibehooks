import { cn } from '@/lib/cn';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
}

function BaseTextArea({ className, ...props }: TextAreaProps) {
	return (
		<textarea
			className={cn(
				'w-full focus:outline-none p-4 rounded-md font-reddit-sans text-sm text-left',
				className
			)}
			{...props}
		/>
	);
}

function Primary(props: TextAreaProps) {
	return (
		<BaseTextArea
			className={cn('border border-white/20 text-white/90', props.className)}
			{...props}
		/>
	);
}

export const TextArea = Object.assign(BaseTextArea, {
	Primary,
});
