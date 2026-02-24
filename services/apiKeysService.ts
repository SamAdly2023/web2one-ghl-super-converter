export async function createApiKey(userId: string, name?: string) {
    const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create API key');
    return res.json();
}

export async function getApiKeysByUserId(userId: string) {
    const res = await fetch(`/api/keys/user/${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch API keys');
    return res.json();
}

export async function revokeApiKey(id: string) {
    const res = await fetch(`/api/keys/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to revoke API key');
    return res.json();
}

export async function cloneWithApiKey(apiKey: string, url: string) {
    const res = await fetch('/api/clone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ url })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Clone failed');
    }

    const text = await res.text();
    return text;
}
