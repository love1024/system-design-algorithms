import { Snowflake } from "../unique-id-generator/snowflake";


/**
 * URL shortener using base62 for hash
 * We can use other hash functions as well as per our output hash size need
 */
export class UrlShortener {
    private cache = new Map<string, string>();
    private idGenerator = new Snowflake(1, 1);
    private charMap = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIZKLMNOPQRSTUVWXYZ';
    
    shorten(url: string): string {
        const hash = this.convertToBase62(url);
        this.cache.set(hash, url);

        return hash;
    }

    originalUrl(short: string): string | null{
        return this.cache.get(short) ?? null;
    }

    private convertToBase62(url: string): string {
        let uniqueid = this.idGenerator.generate();
        let base62Value = '';
        while(uniqueid > 0n) {
            const rem = Number(uniqueid % 62n);
            base62Value += this.charMap[rem];
            uniqueid = uniqueid/62n;
        }

        return base62Value;
    }
}

const urlShortener = new UrlShortener();
const shortUrl = urlShortener.shorten('https://medium.com');
console.log(shortUrl);
console.log(urlShortener.originalUrl(shortUrl));