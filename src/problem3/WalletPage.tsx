interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

enum BlockchainPriority {
    Osmosis = 100,
    Ethereum = 50,
    Arbitrum = 30,
    Zilliqa = 20,
    Neo = 20,
    Unknown = -99
}

const getPriority = (blockchain: string): number =>
    BlockchainPriority[blockchain as keyof typeof BlockchainPriority] ?? BlockchainPriority.Unknown;

interface Props extends BoxProps { }

const WalletPage: React.FC<Props> = ({ ...rest }) => {
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances
            .filter(
                (balance) =>
                    getPriority(balance.blockchain) > BlockchainPriority.Unknown &&
                    balance.amount <= 0
            )
            .sort(
                (a, b) =>
                    getPriority(b.blockchain) - getPriority(a.blockchain)
            );
    }, [balances]);

    const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
        return sortedBalances.map((balance): FormattedWalletBalance => ({
            ...balance,
            formatted: balance.amount.toFixed(2)
        }));
    }, [sortedBalances]);

    const rows = useMemo(() => {
        return formattedBalances.map((balance) => {
            const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

            return (
                <WalletRow
                    className={classes.row}
                    key={`${balance.blockchain}-${balance.currency}`}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            );
        });
    }, [formattedBalances, prices]);

    // Render component
    return <div {...rest}>{rows}</div>;
};
