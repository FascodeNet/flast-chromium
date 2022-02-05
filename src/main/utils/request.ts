import https from 'https';
import { PeerCertificate, TLSSocket } from 'tls';
import { APPLICATION_PROTOCOL, EXTENSION_PROTOCOL } from '../../utils';

export type RequestType = 'secure' | 'insecure' | 'file' | 'source' | 'search' | 'internal' | 'extension';

export interface RequestState {
    type: RequestType;
    certificate?: PeerCertificate;
}

const getDomain = (url: string) => {
    let hostname = url;

    if (hostname.indexOf('http://') !== -1 || hostname.indexOf('https://') !== -1)
        hostname = hostname.split('://')[1];
    if (hostname.indexOf('?') !== -1)
        hostname = hostname.split('?')[0];

    hostname = hostname.indexOf('://') !== -1 ? `${hostname.split('://')[0]}://${hostname.split('/')[2]}` : hostname.split('/')[0];

    return hostname;
};

export const getRequestState = (url: string): Promise<RequestState> => new Promise<RequestState>((resolve) => {
    try {
        const { protocol } = new URL(url);

        switch (protocol.toLowerCase()) {
            case 'http:':
                return resolve({ type: 'insecure' });
            case 'https:':
                const domain = getDomain(url);

                let options = {
                    host: domain,
                    port: 443,
                    method: 'GET'
                };

                let req = https.request(options, async (res) => {
                    let certificate = (res.socket as TLSSocket).getPeerCertificate();
                    if (!certificate.subject)
                        return resolve({ type: 'insecure' });

                    console.log(certificate);

                    return resolve({ type: 'secure', certificate });
                });

                req.end();
                break;
            case 'file:':
                return resolve({ type: 'file' });
            case 'view-source:':
                return resolve({ type: 'source' });
            case `${APPLICATION_PROTOCOL}:`:
                return resolve({ type: 'internal' });
            case `${EXTENSION_PROTOCOL}:`:
                return resolve({ type: 'extension' });
        }
    } catch {
        return resolve({ type: 'insecure' });
    }
});
