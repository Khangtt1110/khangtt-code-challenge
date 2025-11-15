import React, { useEffect, useMemo, useState } from 'react';
import { PriceService } from '@src/services/tokenService';
import { TokenItem } from '@src/types/token';

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
                    image: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${t.currency}.svg`,
                }));

                setTokens(mapped);
            } catch (e) {
                setError(e as string);
            } finally {
                setLoadingTokens(false);
            }
        })();
    }, []);

    const priceOf = (symbol: string) => tokens.find((t) => t.currency === symbol)?.price ?? 0;

    const canSwap = useMemo(() => {
        return !loading && from && to && from !== to && !!amount && Number(amount) > 0;
    }, [loading, from, to, amount]);

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
            const usdValue = Number(amount) * fromPrice;
            const converted = usdValue / toPrice;
            await new Promise((r) => setTimeout(r, 800));
            setResult(converted);
        } catch {
            setError('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleReverse = () => {
        setResult(null);
        setFrom((prev) => {
            setTo(prev || '');
            return to || '';
        });
    };

    const handleReset = () => {
        setFrom('');
        setTo('');
        setAmount('');
        setResult(null);
        setError(null);
    };

    const TokenDropdown = ({
        selected,
        onChange,
        placeholder,
    }: {
        selected: string;
        onChange: (value: string) => void;
        placeholder: string;
    }) => {
        const [open, setOpen] = useState(false);

        const handleSelect = (token: Token) => {
            onChange(token.currency);
            setOpen(false);
        };

        const selectedToken = tokens.find((t) => t.currency === selected);

        return (
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="w-full border rounded p-2 flex items-center gap-2 justify-between focus:ring-2 focus:ring-indigo-500 transition"
                >
                    {selectedToken ? (
                        <>
                            <img
                                src={selectedToken.image}
                                alt={selectedToken.currency}
                                className="w-6 h-6"
                                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                            />
                            <span>{selectedToken.currency}</span>
                        </>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                    <span className="ml-auto text-gray-500">{open ? '▲' : '▼'}</span>
                </button>
                {open && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                        {tokens.map((t) => (
                            <li
                                key={t.currency}
                                onClick={() => handleSelect(t)}
                                className="p-2 flex items-center gap-2 hover:bg-indigo-100 cursor-pointer transition"
                            >
                                <img
                                    src={t.image}
                                    alt={t.currency}
                                    className="w-6 h-6"
                                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                                />
                                <span>{t.currency}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="w-11/12 md:w-1/2 lg:w-1/3 mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
            <h2 className="text-2xl font-bold text-center mb-5 text-gray-800">Fancy Swap</h2>

            {error && <div className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}

            <div className="flex gap-2 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-700">From</label>
                    <TokenDropdown selected={from} onChange={setFrom} placeholder="Select token" />
                </div>

                <div className="flex items-end pb-1">
                    <button
                        type="button"
                        onClick={handleReverse}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-xl font-bold size-10 flex items-center justify-center"
                        title="Reverse"
                    >
                        ⇄
                    </button>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-700">To</label>
                    <TokenDropdown selected={to} onChange={setTo} placeholder="Select token" />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Amount</label>
                <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0.0"
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
            </div>

            <div className="flex gap-2">
                <button
                    disabled={!canSwap}
                    onClick={handleSwap}
                    className={`flex-1 py-2 rounded text-white font-medium transition ${
                        canSwap ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Swapping...' : 'Swap'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 border rounded hover:bg-gray-50 transition"
                >
                    Reset
                </button>
            </div>

            <div className="mt-5">
                {loadingTokens && <div className="text-gray-500 text-sm">Loading tokens…</div>}
                {!loadingTokens && tokens.length === 0 && <div className="text-gray-500 text-sm">No tokens available.</div>}
                {result !== null && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded p-3 text-gray-800">
                        <p className="text-sm mb-1">Result:</p>
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