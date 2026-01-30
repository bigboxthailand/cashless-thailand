
export interface EmailPayload {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    text?: string;
}

export async function sendEmail(payload: EmailPayload) {
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const DEFAULT_FROM = import.meta.env.PUBLIC_EMAIL_FROM || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing');
        return { error: 'Email configuration missing' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: payload.from || DEFAULT_FROM,
                to: Array.isArray(payload.to) ? payload.to : [payload.to],
                subject: payload.subject,
                html: payload.html,
                text: payload.text
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        return { data };
    } catch (error: any) {
        console.error('Resend Error:', error);
        return { error: error.message };
    }
}
