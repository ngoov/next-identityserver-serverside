import { Issuer } from 'openid-client';


const initializeOpenIdClient = async () => {
    console.log(`before discover`);
    let issuer = {} as Issuer;
    try{
        issuer = await Issuer.discover('https://demo.duendesoftware.com/.well-known/openid-configuration');
    }catch(err){
        console.error('err on discover', err)
    }
    const { Client, metadata } = issuer;
    console.log(`Issuer metadata: ${metadata}`);
    return Client;
}

export {initializeOpenIdClient};
