import { Issuer } from 'openid-client';


const initializeOpenIdClient = async () => {
    const issuer = await Issuer.discover('https://accounts.google.com');
    const { Client, metadata } = issuer;
    console.log(`Issuer metadata: ${metadata}`);
    return Client;
}

export {initializeOpenIdClient};
