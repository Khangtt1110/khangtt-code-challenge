import { PriceService } from '@src/services/tokenService';
import { TokenItem } from '@src/types/token';
import React, { useEffect, useMemo, useState } from 'react';

const FALLBACK_IMAGE = '/svgs/token-fallback.svg';

interface Token {
    currency: string;
    image: string;
    price: number;
}

const SwapForm: React.FC = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [amount, setAmount] = useState<number | ''>('');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingTokens, setLoadingTokens] = useState(true);

    /** Fetch token prices on mount */
    useEffect(() => {
        (async () => {
            setLoadingTokens(true);
            try {
                const resp = await PriceService.getPrices();
                if (!resp.status) throw new Error(resp.message);

                const data = resp.data.tokens as TokenItem[];
                const valid = data.filter((t) => !!t.price);

                const mapped: Token[] = valid.map((t) => ({
                    currency: t.currency,
                    price: t.price,
                    image: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${t.currency}.svg`
                }));

                setTokens(mapped);
            } catch (e) {
                setError('Failed to fetch token prices');
            } finally {
                setLoadingTokens(false);
            }
        })();
    }, []);

    /** Get token price by symbol */
    const priceOf = (symbol: string) => tokens.find((t) => t.currency === symbol)?.price ?? 0;

    /** Determine if swap can be performed */
    const canSwap = useMemo(() => {
        return !loading && from && to && from !== to && !!amount && Number(amount) > 0;
    }, [loading, from, to, amount]);

    /** Swap Logic */
    const handleSwap = async () => {
        setError(null);
        setResult(null);

        if (!canSwap) {
            setError('Please enter valid inputs');
            return;
        }

        setLoading(true);
        try {
            const fromPrice = priceOf(from);
            const toPrice = priceOf(to);

            if (!fromPrice || !toPrice) {
                setError('Price not available for selected tokens');
                setLoading(false);
                return;
            }

            // convert: from → USD → to
            const usdValue = Number(amount) * fromPrice;
            const converted = usdValue / toPrice;

            // simulate backend delay
            await new Promise((r) => setTimeout(r, 800));
            setResult(converted);
        } catch {
            setError('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    /** Reverse currencies */
    const handleReverse = () => {
        setResult(null);
        setFrom((prev) => {
            setTo(prev || '');
            return to || '';
        });
    };

    /** Reset form */
    const handleReset = () => {
        setFrom('');
        setTo('');
        setAmount('');
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-10">
            <h2 className="text-2xl font-semibold text-center mb-5">Fancy Form</h2>

            {error && <div className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}

            <div className="flex gap-2 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">From</label>
                    <div className="relative">
                        <select
                            className="w-full border rounded p-2 pl-9"
                            value={from}
                            onChange={(e) => {
                                setFrom(e.target.value);
                                setResult(null);
                            }}
                        >
                            <option value="">Select token</option>
                            {tokens.map((t) => (
                                <option key={t.currency} value={t.currency}>
                                    {t.currency}
                                </option>
                            ))}
                        </select>
                        {from && (
                            <img
                                src={tokens.find((t) => t.currency === from)?.image || FALLBACK_IMAGE}
                                alt={from}
                                className="absolute left-2 top-2 w-6 h-6"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.onerror = null;
                                    target.src = FALLBACK_IMAGE;
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-end pb-1">
                    <button type="button" onClick={handleReverse} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full size-10" title="Reverse">
                        ⇄
                    </button>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">To</label>
                    <div className="relative">
                        <select
                            className="w-full border rounded p-2 pl-9"
                            value={to}
                            onChange={(e) => {
                                setTo(e.target.value);
                                setResult(null);
                            }}
                        >
                            <option value="">Select token</option>
                            {tokens.map((t) => (
                                <option key={t.currency} value={t.currency}>
                                    {t.currency}
                                </option>
                            ))}
                        </select>
                        {to && (
                            <img
                                src={tokens.find((t) => t.currency === to)?.image || FALLBACK_IMAGE}
                                alt={to}
                                className="absolute left-2 top-2 w-6 h-6"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.onerror = null;
                                    target.src = FALLBACK_IMAGE;
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0.0" className="w-full border rounded p-2" />
            </div>

            <div className="flex gap-2">
                <button disabled={!canSwap} onClick={handleSwap} className={`flex-1 py-2 rounded text-white font-medium transition ${canSwap ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                    {loading ? 'Swapping...' : 'Swap'}
                </button>

                <button onClick={handleReset} className="px-4 py-2 border rounded hover:bg-gray-50">
                    Reset
                </button>
            </div>

            <div className="mt-5">
                {loadingTokens && <div className="text-gray-500 text-sm">Loading tokens…</div>}
                {!loadingTokens && tokens.length === 0 && <div className="text-gray-500 text-sm">No tokens available.</div>}
                {result !== null && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-gray-700 text-sm mb-1">Result:</p>
                        <p className="font-semibold">
                            {amount} {from} ≈ {result.toFixed(6)} {to}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            1 {from} ≈ {(priceOf(from) / priceOf(to)).toFixed(6)} {to}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwapForm;
