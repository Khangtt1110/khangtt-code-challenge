import { ApiResponse } from '@src/types/api';
import { TokensData } from '@src/types/token';
import tokensJson from '@src/mocks/tokens.json';

export class PriceService {
    static async getPrices(): Promise<ApiResponse<TokensData>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(tokensJson as ApiResponse<TokensData>);
            }, 500);
        });
    }
}
