'use client';

import { useState, useEffect } from 'react';

import { useCookies } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

const COOKIE_NAME = 'cookie-consent';

export default function Demo() {
	const cookies = useCookies();
	const [consent, setConsent] = useState<string | null>(null);

	const handleAccept = () => {
		cookies.set(COOKIE_NAME, 'accepted', {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			sameSite: 'lax',
		});
		setConsent('accepted');
	};

	const handleDecline = () => {
		cookies.set(COOKIE_NAME, 'rejected', {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			sameSite: 'lax',
		});
		setConsent('rejected');
	};

	useEffect(() => {
		setTimeout(() => {
			setConsent(cookies.get(COOKIE_NAME));
		}, 100);
	}, [cookies]);

	if (consent === 'accepted') return null;

	return (
		<Layout>
			<Layout.Title>🍪 Cookies and Privacy</Layout.Title>
			<Layout.Caption>
				We use cookies to improve your experience. You can accept or decline the
				use of cookies by clicking on the button below.
			</Layout.Caption>
			<div className='w-full flex flex-row items-center justify-center gap-2'>
				<Button.Destructive
					disabled={consent === 'accepted'}
					onClick={handleDecline}
				>
					Decline
				</Button.Destructive>
				<Button.Primary onClick={handleAccept}>Accept</Button.Primary>
			</div>
		</Layout>
	);
}
