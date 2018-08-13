'use strict';

const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);
if (typeof web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
} else {
    window.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
    );
}

/**
 * Convert Number to BigNumber
 * @param x Some number
 * @returns {*} BigNumber
 */
const tbn = (x) => new BigNumber(x);

const assets = {
    'Waves': 'WAVES',
    'Bitcoin': '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
    'BitcoinCash': 'zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy',
    'Ethereum': '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    'ZCash': 'BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa',
    'Litecoin': 'HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk',
    'Dash': 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
    'Monero': '5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3',
    'US_Dollar': 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    'Euro': 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU'
};

const currency = {
    "Bitcoin": {
        course: 'btc-rub',
        name: "Bitcoin",
        ticker: "BTC",
        assetID: assets.Bitcoin
    },
    "Ethereum": {
        course: 'eth-rub',
        name: "Ethereum",
        ticker: "ETH",
        assetID: assets.Ethereum
    },
    "Waves": {
        course: 'waves-rub',
        name: "Waves",
        ticker: "WAVES",
        assetID: assets.Waves
    },
    "ZCash": {
        course: 'zec-rub',
        name: "ZCash",
        ticker: "ZEC",
        assetID: assets.ZCash
    },
    "Litecoin": {
        course: 'ltc-rub',
        name: "Litecoin",
        ticker: "LTC",
        assetID: assets.Litecoin
    },
    "US Dollar": {
        course: 'usd-rub',
        name: "US Dollar",
        name1: 'US_Dollar',
        ticker: "USD",
        assetID: assets.US_Dollar
    },
    "Euro": {
        course: 'eur-rub',
        name: "Euro",
        ticker: "EUR",
        assetID: assets.Euro
    },
};

const exchange = {
    'Waves': {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.Bitcoin
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Waves
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Waves
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Waves
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Waves,
            'assetID2': assets.Euro
        }
    },
    'Bitcoin': {
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.Bitcoin
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Bitcoin
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Bitcoin
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Bitcoin
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.Euro
        }
    },
    'Ethereum': {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Waves
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Ethereum
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Ethereum
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Euro
        }
    },
    "ZCash": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Waves
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Ethereum
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.ZCash
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.ZCash,
            'assetID2': assets.Euro
        }
    },
    "Litecoin": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Bitcoin
        },
        'Waves': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Waves
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Ethereum
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.ZCash
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'sell',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Euro
        }
    },
    "US Dollar": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.US_Dollar
        },
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.US_Dollar
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.US_Dollar
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.US_Dollar
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.US_Dollar
        },
        'Euro': {
            'type': 'buy',
            'assetID1': assets.Euro,
            'assetID2': assets.US_Dollar
        }
    },
    "Euro": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': assets.Bitcoin,
            'assetID2': assets.Euro
        },
        'Waves': {
            'type': 'buy',
            'assetID1': assets.Waves,
            'assetID2': assets.Euro
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': assets.Ethereum,
            'assetID2': assets.Euro
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': assets.ZCash,
            'assetID2': assets.Euro
        },
        'Litecoin': {
            'type': 'buy',
            'assetID1': assets.Litecoin,
            'assetID2': assets.Euro
        },
        'US Dollar': {
            'type': 'sell',
            'assetID1': assets.Euro,
            'assetID2': assets.US_Dollar
        }
    }
};

class LightySig {

    constructor() {
        this.Waves = _Waves;
        this.Ethereum = _Ethereum;
        this.utils = {
            course: Course
        }
    }

}

const _Waves = {
    account: {
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
    },
    balance: {
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
    },
    transactions: {
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
                feeassetID: assets.Waves,
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
                feeassetID: assets.Waves,
                fee: 100000,
                attachment: '',
                timestamp: Date.now()
            };

            const responseData = await Waves.API.Node.transactions.broadcast('transaction', transferData, sender.keyPair);
            return responseData;
        }
    },
    exchange: {
        /**
         * Allows to get asset pair with bids and asks
         * @param currencyToSell Currency that will be sell
         * @param currencyToBuy Currency that will be buy
         * @returns {Promise<any>} Order book object
         */
        getOrderBook: async (currencyToSell, currencyToBuy) => {
            const sell = currency[currencyToSell].assetID;
            const buy = currency[currencyToBuy].assetID;

            const response = await $.get({
                url: `https://matcher.wavesplatform.com/matcher/orderbook/${sell}/${buy}`,
                type: 'GET',
                dataType: 'text'
            });

            return JSON.parse(response);
        },
        /**
         * Calculate order properties
         * @param currencyToSell Currency that will be sell
         * @param currencyToBuy Currency that will be buy
         * @param amount Amount of currency that will be buy
         * @returns {Promise<{amountAsset: *, priceAsset: *, type: *, amount: *, price: (*|content.price|{type, required})}>} Object with properties
         */
        getOrderProperties: async (currencyToSell, currencyToBuy, amount) => {
            const orderBook = await Exchange.getOrderBook(currencyToSell, currencyToBuy);

            const type = exchange[currencyToSell][currencyToBuy].type;

            let dependency;
            if (type === 'sell') {
                dependency = 'bids';
            } else {
                dependency = 'asks';
            }

            let priceIndex;
            for (let i in orderBook[dependency]) {
                const price = orderBook[dependency][i].price;
                let _amount = amount;
                if (type === 'sell')
                    _amount = _Waves.utils.tw(tbn(amount).div(price)).toNumber();
                if (orderBook[dependency][i].amount >= _amount) {
                    priceIndex = i;
                    amount = _amount;
                    break;
                }
            }

            const price = orderBook[dependency][priceIndex].price;

            return {
                amountAsset: orderBook.pair.amountAsset,
                priceAsset: orderBook.pair.priceAsset,
                type: type,
                amount: amount,
                price: price,
            }
        },
        /**
         * Allows to create tx object for exchange cryptocurrencies
         * @param amountAssetId ID of asset that will be in amount field
         * @param priceAssetId ID of asset that will be in price field
         * @param orderType Type of order (buy or sell)
         * @param amount Amount of currency that will be sell or buy
         * @param price Exchange rate
         * @param expiration After that time created and not used order will be closed
         * @param sender Seed Object
         * @returns {Promise<{senderPublicKey: *, matcherPublicKey, amountAsset: *, priceAsset: *, orderType: *, amount: *, price: *, timestamp: number, expiration: number, matcherFee: number}>} tx object
         */
        createTXObject: async (amountAssetId, priceAssetId, orderType, amount, price, expiration, sender) => {
            const matcherPublicKey = await Waves.API.Matcher.getMatcherKey();

            const transferData = {
                senderPublicKey: sender.keyPair.publicKey,
                matcherPublicKey: matcherPublicKey,
                amountAsset: amountAssetId,
                priceAsset: priceAssetId,
                orderType: orderType,
                amount: amount,
                price: price,
                timestamp: Number(Date.now()),
                expiration: Number(Date.now() + expiration),
                matcherFee: 300000
            };

            return transferData;
        },
        /**
         * Allows to sign exchange transaction
         * @param currencyToSell Currency that will be sell
         * @param currencyToBuy Currency that will be buy
         * @param amount Amount of currency that will be buy
         * @param expiration After that time created and not used order will be closed
         * @param seedPhrase A set of 15 words
         * @returns {Promise<any>} Sign transaction object
         */
        signTransaction: async (currencyToSell, currencyToBuy, amount, expiration, seedPhrase) => {
            const sender = Account.getSeedFromPhrase(seedPhrase);

            const orderProperties = await Exchange.getOrderProperties(currencyToSell, currencyToBuy, amount);

            try {
                const TX_OBJECT = await Exchange.createTXObject(
                    orderProperties.amountAsset,
                    orderProperties.priceAsset,
                    orderProperties.type,
                    orderProperties.amount,
                    orderProperties.price,
                    expiration,
                    sender
                );

                let signedTransaction = await Waves.API.Matcher.signTransaction(TX_OBJECT, sender.keyPair);

                let data = JSON.parse(signedTransaction.body);

                return data;
            } catch (e) {
                throw e;
            }
        },
        /**
         * Allows to send signed exchange transaction
         * @param data Signed transaction object
         * @returns {Promise<void>}
         */
        sendSigned: async (data) => {
            const transferData = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(data)
            };

            const responseData = await Waves.API.Matcher.send(transferData);
            return responseData;
        },
        /**
         * Allows to create order with min price in buy and max price in sell
         * @param currencyToSell Currency that will be sell
         * @param currencyToBuy Currency that will be buy
         * @param amount Amount of currency that will be buy
         * @param expiration After that time created and not used order will be closed
         * @param seedPhrase A set of 15 words
         * @returns {Promise<void>} Accepted order (or not accepted) object
         */
        createCustomOrder: async (currencyToSell, currencyToBuy, amount, expiration, seedPhrase) => {
            const sender = Account.getSeedFromPhrase(seedPhrase);

            const orderProperties = await Exchange.getOrderProperties(currencyToSell, currencyToBuy, amount);

            try {
                const TX_OBJECT = await Exchange.createTXObject(
                    orderProperties.amountAsset,
                    orderProperties.priceAsset,
                    orderProperties.type,
                    orderProperties.amount,
                    orderProperties.price,
                    expiration,
                    sender
                );

                return await Waves.API.Matcher.createOrder(TX_OBJECT, sender.keyPair);
            } catch (e) {
                throw e;
            }
        },
    },
    utils: {
        /**
         * Convert Number (or BN) to this * 10^8
         * @param x Some number
         * @returns {*} Number * 10^8
         */
        tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e8).toFixed(0) : tbn(x).times(1e8).toFixed(0),

        /**
         * Convert from minimal Waves unit
         * @param x Some number
         * @returns {*} Converted number
         */
        fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-8).toNumber() : tbn(x).times(1e-8).toNumber()
    }
};

const _Ethereum = {
    /**
     * Allows to change RPC url. Default: http://localhost:8545/
     * @param url New RPC URL
     */
    setRPCurl: (url) => {
        window.web3 = new Web3(new Web3.providers.HttpProvider(url))
    },
    account: {
        /**
         * Allows to create new private key
         * @returns {string} Private key
         */
        create: () => {
            let params = {
                keyBytes: 32,
                ivBytes: 16
            };
            let dk = keythereum.create(params);

            return "0x" + dk.privateKey.reduce((memo, i) => {
                return memo + ('0' + i.toString(16)).slice(-2);
            }, '');
        },
        /**
         * Allows to get address from private key
         * @param privateKey
         * @returns {*} Address
         */
        getAddress: (privateKey) => {
            let _privateKey = "";
            for (let i = 2; i < privateKey.length; i++) {
                _privateKey += privateKey[i];
            }
            return keythereum.privateKeyToAddress(_privateKey);
        }
    },
    balance: {
        /**
         * Allows to get address balance
         * @param address Address
         * @returns {Promise<*>} Balance (don't forget about 1e18)
         */
        getBalance: async (address) => {
            return await web3.eth.getBalance(address);
        }
    },
    transactions: {
        /**
         * Allows to sign any Ethereum transaction.
         * Using this function you can sign one or more tx in one time
         * @param receivers Array of the receivers (can be contract address)
         * @param values Array of values (if it non-payable func add 0 to array's elements)
         * @param privateKey Sender's Private Key
         * @param datas Hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         * @returns {Promse<any>} Signed hex string
         */
        signTransaction: async (receivers, values, privateKey, datas) => {
            if (typeof datas === 'undefined') {
                datas = [];
                datas[receivers.length - 1] = null;
            }

            if (receivers.length != values.length || values.length != datas.length)
                return new Error(`You have ${receivers.length} receivers, ${values.length} values and ${datas.length} datas. It should be equal.`);

            const address = _Ethereum.account.getAddress(privateKey);
            let nonce = await web3.eth.getTransactionCount(address);

            const signedTX = [];
            for (let i in receivers) {
                const txParam = {
                    nonce: nonce,
                    to: receivers[i],
                    value: values[i],
                    from: address,
                    data: datas[i],
                    gasPrice: 0x3b9bca00,
                    gas: 210000
                };

                const tx = new ethereumjs.Tx(txParam);
                const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(privateKey.substring(2), 'hex');
                tx.sign(privateKeyBuffer);
                const serializedTx = tx.serialize();
                signedTX.push('0x' + serializedTx.toString('hex'));
                nonce++;
            }

            return signedTX;
        },
        /**
         * Allows to send signed transactions to blockchain
         * @param rawTransations Signed hex string
         * @returns {Promise<Array>} if success tx hash
         */
        sendSigned: async (rawTransations) => {
            const results = [];

            for (let i in rawTransations) {
                await web3.eth.sendSignedTransaction(rawTransations[i], (err, transactionHash) => {
                    if (err) {
                        results.push(err);
                        return;
                    }

                    results.push(transactionHash);
                });
            }

            return results;
        },
    },
    contract: {
        /**
         * Creates a new contract instance with all its methods and events defined in its json interface object
         * @param CONTRACT_ABI  application binary interface (look at remix)
         * @param CONTRACT_ADDRESS Address of contract
         * @returns {*} Contract instance
         */
        getInstance: (CONTRACT_ABI, CONTRACT_ADDRESS) => {
            const instance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            return instance;
        },
        /**
         * Allows you to receive hexadecimal data for a function call using a manual signature and sending a transaction
         * @param instance Contract instance
         * @param methodName Name of the solidity function
         * @param parameters Solidity function parameters
         * @returns {*} hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         */
        getCallData: (instance, methodName, ...parameters) => {
            const data = instance.methods[methodName](...parameters).encodeABI();
            return data;
        },
        /**
         * Allows to call get function on contract
         * @param instance Contract instance
         * @param methodName Name of the solidity function
         * @param addressFrom Sender address
         * @param parameters Solidity function parameters
         * @returns {Promise<*>} Result
         */
        get: async (instance, methodName, addressFrom, ...parameters) => {
                let result = await instance.methods[methodName](...parameters).call({from: addressFrom});
                return result;
        }
    },
    utils: {
        /**
         * Convert Number (or BN) to this * 10^18
         * @param x Some number
         * @returns {*} Number * 10^18
         */
        tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e18).toFixed(0) : tbn(x).times(1e18).toFixed(0),

        /**
         * Convert from minimal Ethereum unit
         * @param x Some number
         * @returns {*} Converted number
         */
        fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber()
    }
};

/* ----COURSE BLOCK START---- */
const Course = {
    /**
     * Allows to get course
     * @param currency Currency, relative to which the course will be taken
     * @returns {Promise<*>} Object with exchange rates
     */
    getCourse: async (currency) => {
        const response = await $.get({
            url: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR,RUB`,
            type: 'GET',
        });

        return response;
    },
    /**
     * Allows to convert currencies
     * @param from Currency that will be changed
     * @param to Destination currency
     * @param value Amount of currency that will be changed
     * @returns {Promise<number>}
     */
    convert: async (from, to, value) => {
        const courses = await Course.getCourse(currency[from].ticker);
        const rate = courses[currency[to].ticker];
        const result = value * rate;
        return result * 1000 % 10 === 0 ? result : result.toFixed(2);
    }
}
/* ----COURSE BLOCK END---- */