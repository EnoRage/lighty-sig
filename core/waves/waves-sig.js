/* ----CONFIG BLOCK START---- */
const CURRENT_NETWORK = WavesAPI.MAINNET_CONFIG;

const TESTNET_CONFIG = {
    networkByte: 84,
    nodeAddress: 'https://testnode3.wavesnodes.com',
    matcherAddress: 'https://testnode3.wavesnodes.com/matcher',
    minimumSeedLength: 50
};

var assets = {
    'Bitcoin': '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
    'BitcoinCash': 'zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy',
    'Ethereum': '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    'ZCash': 'BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa',
    'Litecoin': 'HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk',
    'Dash': 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
    'Monero': '5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3',
    'US_Dollar': 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    'Euro': 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU'
}
/* ----CONFIG BLOCK END---- */


/* ----INITIALIZE BLOCK START---- */
const Waves = WavesAPI.create(CURRENT_NETWORK);
// Waves.config.set(TESTNET_CONFIG);
/* ----INITIALIZE BLOCK END---- */


/* ----KEY PAIR BLOCK START---- */
const Account = {
    /**
     * Allows to create new key pairs
     * @returns {Seed} Seed Object (phrase, address, keyPair)
     */
    create: () => {
        const seed = Waves.Seed.create();
        return seed;
    },
    /**
     * Allows to encrypt seed phrase
     * @param seed User's seed phrase
     * @param password Encryption key
     * @returns {*} Encrypted Seed
     */
    encrypt: (phrase, password) => {
        const seed = Account.getSeedFromPhrase(phrase);
        const encrypted = seed.encrypt(password);
        return encrypted;
    },
    /**
     * Allows to decrypt seed phrase
     * @param encryptedSeed Encrypted seed
     * @param password Decryption key
     * @returns {string} Seed Phrase
     */
    decrypt: (encryptedSeed, password) => {
        const restoredPhrase = Waves.Seed.decryptSeedPhrase(encryptedSeed, password);
        return restoredPhrase;
    },
    /**
     * Get seed object from seed phrase
     * @param phrase A set of 15 words
     * @returns {Seed} {Seed} Seed Object (phrase, address, keyPair)
     */
    getSeedFromPhrase: (phrase) => {
        const seed = Waves.Seed.fromExistingPhrase(phrase);
        return seed;
    },
    /**
     * Allows to get address from seed phrase
     * @param phrase A set of 15 words
     * @returns {*} User's address
     */
    getAddressFromSeedPhrase: (phrase) => {
        return Account.getSeedFromPhrase(phrase).address;
    },
}
/* ----KEY PAIR BLOCK END---- */


/* ----BALANCE BLOCK START----- */
const Balance = {
    /**
     * Allows to get Waves balance
     * @param address User's address
     * @returns {Promise<any>} balance
     */
    waves: async (address) => {
        const balance = await Waves.API.Node.addresses.balance(address, 6);
        return balance;
    },
    /**
     * Allows to get balance of all assets excluding Waves
     * @param address User's address
     * @returns {Promise<balances|((address: string) => Promise<any>)|((address: string) => Promise<any>)>} Array of assets balances
     */
    assets: async (address) => {
        const user = await Waves.API.Node.assets.balances(address);
        return user.balances;
    },
    /**
     * Allows to get balance of any one asset
     * @param address User's address
     * @param assetID ID of asset
     * @returns {Promise<*>} balance
     */
    byAssetID:
        async (address, assetID) => {
            const user = await Waves.API.Node.assets.balance(address, assetID);
            return user.balance;
        },
    /**
     * Allows to get object with balances of any assetsId
     * @param address User's address
     * @param assetsID Array or Object includes assetsId of currencies
     * @returns {Promise<void>} Object of balances
     */
    byAssetIDArray:
        async (address, assetsID) => {
            const assetsBalance = await Balance.assets(address);

            let balances = {};

            for (let i in assetsID) {
                assetsBalance.map(asset => {
                    if (asset.assetId == assetsID[i])
                        balances[i] = asset.balance
                });
            }

            return balances;
        },
}


/* ----TX TRANSFER BLOCK START---- */
const Transactions = {
    /**
     * Allows to sign transaction
     * @param recipient User that will get currency
     * @param assetId AssetId of the currency
     * @param amount Amount of currency
     * @param seedPhrase A set of 15 words
     * @returns {Promise<any>} Signed object of transaction
     */
    signTransaction: async (recipient, assetId, amount, seedPhrase) => {
        const sender = Account.getSeedFromPhrase(seedPhrase);

        const transferData = {
            type: Waves.constants.TRANSFER_TX,
            sender: sender.keyPair.address,
            recipient: recipient,
            senderPublicKey: sender.keyPair.publicKey,
            assetId: assetId,
            amount: amount,
            feeAssetId: 'WAVES',
            fee: 100000,
            attachment: '',
            timestamp: Date.now()
        };

        let signedTransaction = await Waves.API.Node.transactions.getSignature('transfer', transferData, sender.keyPair);

        let data = JSON.parse(signedTransaction.body);
        data.type = Waves.constants.TRANSFER_TX;

        return data;
    },
    /**
     * Allows to send signed transaction
     * @param data Signed transaction object
     * @returns {Promise<void>}
     */
    sendSigned: async (data) => {
        const responseData = await Waves.API.Node.transactions.rawBroadcast(data);
        return responseData;
    },
    /**
     * Allows to sign and send a transaction (currency)
     * @param recipient User that will get currency
     * @param assetId AssetId of the currency
     * @param amount Amount of currency
     * @param seedPhrase A set of 15 words
     * @returns {Promise<any>} Signed object of transaction
     */
    send: async (recipient, assetId, amount, seedPhrase) => {
        const sender = Account.getSeedFromPhrase(seedPhrase);

        const transferData = {
            type: Waves.constants.TRANSFER_TX,
            sender: sender.keyPair.address,
            recipient: recipient,
            senderPublicKey: sender.keyPair.publicKey,
            assetId: assetId,
            amount: amount,
            feeAssetId: 'WAVES',
            fee: 100000,
            attachment: '',
            timestamp: Date.now()
        };

        const responseData = await Waves.API.Node.transactions.broadcast('transaction', transferData, sender.keyPair);
        return responseData;
    }
}
/* ----TX TRANSFER BLOCK END---- */


/* ----DEX BLOCK START---- */

/* ----DEX BLOCK END---- */

