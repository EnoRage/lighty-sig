const NETWORKS = {
    BITCOIN: {
        LIVENET: {
            FOR_ACCOUNT: BitcoinJS.Networks1.livenet,
            FOR_TX: BitcoinJS.Networks.livenet
        },
        TESTNET: {
            FOR_ACCOUNT: BitcoinJS.Networks1.testnet,
            FOR_TX: BitcoinJS.Networks.testnet
        }
    },
    BITCOIN_CASH: {
        LIVENET: bch.Networks.livenet,
        TESTNET: bch.Networks.testnet
    },
    LITECOIN: {
        LIVENET: litecoin.litecoin.Networks.livenet,
        TESTNET: litecoin.litecoin.Networks.testnet
    }
};

const Currencies = {
    ethereum: {
        decimalMultiplier: 1e18,
        gas: 21000,
        gasPrice: () => {
            return new Promise((resolve, reject) => {
                web3.eth.getGasPrice((e, r) => {
                    if (e)
                        reject(Error("Can't get gas price"));
                    resolve(r.toNumber());
                });
            });
        },
        getFee: async () => {
            const gasPrice = await Currencies.ethereum.gasPrice();
            return (gasPrice * Currencies.ethereum.gas);
        },
        sendTransaction: async (from, to, value, callback) => {
            const nonce1 = web3.eth.getTransactionCount(Currencies.ethereum.getAddress(from));
            let nonce = 0;
            const gasPrice = await Currencies.ethereum.gasPrice();
            for (let i in to) {

                const txParam = {
                    nonce: Number(nonce) + Number(nonce1),
                    to: to[i],
                    from: Currencies.ethereum.getAddress(from),
                    value: Number(value[i]),
                    gasPrice: gasPrice,
                    gas: Currencies.ethereum.gas
                };

                const tx = new ethereumjs.Tx(txParam);
                const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(from.substring(2), 'hex');
                tx.sign(privateKeyBuffer);
                const serializedTx = tx.serialize();

                web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, transactionHash) => {
                    if (err) {
                        console.log(err)
                        callback(Error('You do not have enough Ethereum'), null);
                    } else {
                        callback(null, transactionHash);
                    }
                });
                nonce++;
            }
        },
        createAccount: () => {
            let params = {
                keyBytes: 32,
                ivBytes: 16
            };
            let dk = keythereum.create(params);

            return "0x" + dk.privateKey.reduce((memo, i) => {
                return memo + ('0' + i.toString(16)).slice(-2);
            }, '');
        },
        getAddress: (prvtKey) => {
            let privateKey = "";
            for (i = 2; i < prvtKey.length; i++) {
                privateKey += prvtKey[i];
            }
            return keythereum.privateKeyToAddress(privateKey);
        },
        getBalance: (address) => {
            // return new Promise((resolve, reject) => {
            return web3.eth.getBalance(address).toNumber();
            // });
        },
    },

    bitcoin: {
        fee: 1e5,
        decimalMultiplier: 1e8,
        currentNetwork: {
            FOR_ACCOUNT: NETWORKS.BITCOIN.LIVENET.FOR_ACCOUNT,
            FOR_TX: NETWORKS.BITCOIN.LIVENET.FOR_TX
        },
        getFee: async () => {
            return await Currencies.bitcoin.fee;
        },
        createAccount: () => {
            return BitcoinJS.createNewAccount(Currencies.bitcoin.currentNetwork.FOR_ACCOUNT);
        },
        getAddress: (privateKey) => {
            return BitcoinJS.getAddress(privateKey, Currencies.bitcoin.currentNetwork.FOR_ACCOUNT);
        },
        getBalance: (address, callback) => {
            return new Promise((resolve, reject) => {
                BitcoinJS.getBalance(address, Currencies.bitcoin.currentNetwork.FOR_ACCOUNT, (err, balance) => {
                    if (err)
                        reject(err);
                    resolve(balance);
                })
            });
        },
        sendTransaction: (from, to, amount, callback) => {
            BitcoinJS.sendTx(from, Currencies.bitcoin.getAddress(from), to, Number(amount), Currencies.bitcoin.currentNetwork.FOR_TX, Currencies.bitcoin.currentNetwork.FOR_ACCOUNT, Currencies.bitcoin.fee, (err, txHash) => {
                if (err) {
                    console.log(err)
                    callback(Error('You do not have enough Bitcoin'), null);
                } else {
                    callback(null, txHash);
                }
            });
        }
    },

    bitcoinCash: {
        fee: 1e5,
        decimalMultiplier: 1e8,
        currentNetwork: NETWORKS.BITCOIN_CASH.LIVENET,
        getFee: async () => {
            return await Currencies.bitcoinCash.fee;
        },
        createAccount: () => {
            return new bch.PrivateKey(Currencies.bitcoinCash.currentNetwork).toString();
        },
        getAddress: (privateKey) => {
            return new bch.PrivateKey(privateKey).toAddress(Currencies.bitcoinCash.currentNetwork).toString();
        },
        getBalance: (address) => {
            return new Promise((resolve, reject) => {
                const toCashAddress = bchaddr.toCashAddress;
                // console.log(toCashAddress)

                const GET_BALANCE_URL = {
                    LIVENET: 'https://bch-insight.bitpay.com/api/addr/' + toCashAddress(address),
                    TESTNET: 'https://test-bch-insight.bitpay.com/api/addr/' + address
                }

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": GET_BALANCE_URL.LIVENET,
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache"
                    },
                    "processData": false,
                }

                $.ajax(settings).done((response) => {
                    // console.log(response)
                    resolve(response.balanceSat)
                }).catch((err) => {
                    console.log(err)
                    reject(err);
                });
            });
        },
        getUTXOs: (address, callback) => {
            // const UTXO_URL = 'https://api.blockchair.com/bitcoin-cash/outputs?';
            const UTXO_URL = {
                LIVENET: 'https://blockdozer.com/api/addr/' + address + '/utxo',
                TESTNET: 'https://tbch.blockdozer.com/api/addr/' + address + '/utxo'
            }
            $.get(UTXO_URL.TESTNET, (res) => {
                callback(res);
            });
        },
        sendTransaction: (from, to, amount, callback) => {
            const SEND_RAW_TX_URL = {
                // LIVENET: 'https://blockdozer.com/api/tx/send',
                // TESTNET: 'https://tbch.blockdozer.com/api/tx/send'
                LIVENET: 'https://bch-insight.bitpay.com/api/tx/send',
                TESTNET: 'https://test-bch-insight.bitpay.com/api/tx/send',
            };

            let totalAmount = 0;
            for (let i in amount) {
                totalAmount += amount[i];
            }

            Currencies.bitcoinCash.getUTXOs(Currencies.bitcoinCash.getAddress(from), (utxos) => {
                console.log(utxos)
                const privateKey = new bch.PrivateKey(from);

                var tx = new bch.Transaction();
                let eqValue = 0;
                for (let i in utxos) {
                    // console.log(utxos[i].satoshis)
                    tx.from(utxos[i]);
                    eqValue += utxos[i].satoshis;
                    if ((eqValue) >= (totalAmount + Currencies.bitcoinCash.fee)) {
                        break;
                    }
                }
                console.log(eqValue)
                if (eqValue == 0 || eqValue < (totalAmount + Currencies.bitcoinCash.fee)) {
                    console.log('Недостаточно средств.');
                    callback(Error('You do not have enough BitcoinCash'), null);
                    return;
                }

                for (let i in to) {
                    tx.to(to[i], Number(amount[i]))
                }

                tx.fee(Currencies.bitcoinCash.fee)
                tx.change(Currencies.bitcoinCash.getAddress(from))
                tx.sign(privateKey);

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": SEND_RAW_TX_URL.TESTNET,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache"
                    },
                    "processData": false,
                    "data": "{\"rawtx\": \"" + tx.toString() + "\"}"
                }

                $.ajax(settings).done(function (response) {
                    console.log(response.txid)
                    callback(null, response.txid)
                }).catch((err) => {
                    callback(err, null);
                });
            });
        }
    },

    litecoin: {
        fee: 1e5,
        decimalMultiplier: 1e8,
        currentNetwork: NETWORKS.LITECOIN.LIVENET,
        getFee: async () => {
            return await Currencies.litecoin.fee;
        },
        createAccount: () => {
            return new litecoin.litecoin.PrivateKey(Currencies.litecoin.currentNetwork).toString();
        },
        getAddress: (privateKey) => {
            return new litecoin.litecoin.PrivateKey(privateKey).toAddress(Currencies.litecoin.currentNetwork).toString();
        },
        getBalance: (address) => {
            return new Promise((resolve, reject) => {
                const GET_BALANCE_URL = {
                    LIVENET: 'https://chain.so/api/v2/get_address_balance/LTC/' + address,
                    TESTNET: 'https://chain.so/api/v2/get_address_balance/LTCTEST/' + address
                }

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": GET_BALANCE_URL.LIVENET,
                    "method": "GET"
                }

                $.ajax(settings).done(response => {
                        resolve(tbn(response.data.confirmed_balance).multipliedBy(Currencies.litecoin.decimalMultiplier).toNumber());
                    })
                    .catch(
                        e => reject(e)
                    );
            });
        },
        getUTXOs: (address, callback) => {
            const UTXO_URL = {
                LIVENET: 'https://chain.so/api/v2/get_tx_unspent/LTC/' + address,
                TESTNET: 'https://chain.so/api/v2/get_tx_unspent/LTCTEST/' + address
            }
            $.get(UTXO_URL.TESTNET, (res) => {
                callback(res.data.txs);
            });
        },
        sendTransaction: (from, to, amount, callback) => {
            const SEND_RAW_TX_URL = {
                LIVENET: 'https://chain.so/api/v2/send_tx/LTC',
                TESTNET: 'https://chain.so/api/v2/send_tx/LTCTEST',
            };

            let totalAmount = 0;
            for (let i in amount) {
                totalAmount += amount[i];
            }

            Currencies.litecoin.getUTXOs(Currencies.litecoin.getAddress(from), (utxos) => {
                const privateKey = new litecoin.litecoin.PrivateKey(from);

                var tx = new litecoin.litecoin.Transaction();
                let eqValue = 0;
                for (let i in utxos) {
                    let utxo = {
                        "txId": utxos[i].txid,
                        "confirmations": utxos[i].confirmations,
                        "vout": utxos[i].output_no,
                        "address": Currencies.litecoin.getAddress(from),
                        "scriptPubKey": utxos[i].script_hex,
                        "satoshis": tbn(utxos[i].value).multipliedBy(1e8).toNumber()
                    };
                    console.log(utxo)
                    tx.from(utxo);
                    eqValue += utxos[i].value * (10 ** 8);
                    if ((eqValue) >= (totalAmount + Currencies.litecoin.fee)) {
                        break;
                    }
                }
                console.log(eqValue)
                if (eqValue == 0 || eqValue < (totalAmount + Currencies.litecoin.fee)) {
                    console.log('Недостаточно средств.');
                    callback(Error('You do not have enough Litecoin'), null);
                    return;
                }

                for (let i in to) {
                    tx.to(to[i], Number(amount[i]));
                }

                tx.fee(Currencies.litecoin.fee)
                tx.change(Currencies.litecoin.getAddress(from))
                tx.sign(privateKey);

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": SEND_RAW_TX_URL.TESTNET,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "processData": false,
                    "data": "{\"tx_hex\": \"" + tx.toString() + "\"}"
                }

                $.ajax(settings).done(function (response) {
                    callback(null, response);
                }).catch((err) => {
                    callback(err, null);
                });
            });
        }
    }
}


// console.log(bitcoinCash.getAddress('e10e4b18aeb6f7ced09101a15abfafec70c2ab8ba8fadf54d4c1060f69985580'));
// console.log(bitcoinCash.getAddress(bitcoinCash.createAccount()))
// 5f70907cda7e6a3295b297b4bdc4ce12c2686d386f23a0f1dbdef43f0b153399
// mvASFTS4uRA75RvnwGN65JrjyCbHTbftXq

// mheQD68b4EBiq9JE2x1o3DPoGw41BzamCo
// e10e4b18aeb6f7ced09101a15abfafec70c2ab8ba8fadf54d4c1060f69985580

// bitcoinCash.sendTransaction('5f70907cda7e6a3295b297b4bdc4ce12c2686d386f23a0f1dbdef43f0b153399', 'mvASFTS4uRA75RvnwGN65JrjyCbHTbftXq', 'mheQD68b4EBiq9JE2x1o3DPoGw41BzamCo', 100000, (err, txHash) => {
//     console.log(err, txHash)
// })

// Litecoin
// 0d851ade01b95aea9fcb5da10540eda2ad74cd1f400f3f28c00ec3174877cfd2
// n356fuub56gqu5cEgK9ahBNwHYV6H7dJTA


// mwCnQAV1ddkGgAdFxHA22XKYCd7f2yaByw
// litecoin.getUTXOs('mikrV7NCXBWL5q8KtHG3xtkqiYsu8HkEzm', (balance) => {
//     console.log(balance)
// })

// litecoin.sendTransaction("0d851ade01b95aea9fcb5da10540eda2ad74cd1f400f3f28c00ec3174877cfd2", "n356fuub56gqu5cEgK9ahBNwHYV6H7dJTA", "mwCnQAV1ddkGgAdFxHA22XKYCd7f2yaByw", 100000, (err, doc) => {
//     console.log(doc)
// });

// bitcoinCash.getUTXOs("mvASFTS4uRA75RvnwGN65JrjyCbHTbftXq", (err,doc) => {
//     console.log(err, doc)
// });

// ethereum.signAndSendRawTx(web3.eth.getTransactionCount(ethereum.getAddress("0x61d94d1c3335c6c30c1336da9e4d54a586f1ffa882338a8bb9f8268296434bc9")),"0x61d94d1c3335c6c30c1336da9e4d54a586f1ffa882338a8bb9f8268296434bc9", "0x9e1f02cf954d1ed9a93be85531196b944a6703a9", 100000000000, (err,doc) => {
//     console.log(doc)
// })

// console.log(bitcoin.currentNetwork)

// bitcoin.sendTransaction("4007c24bb51fc19e9e34739b67a70332a4f46bcbbb56bdb31b6ba25ec5b1fe05", "mm2m5aMLJBPicW97dLD9ZJWUbvFNfQcSgU", 0.0004, (err, doc) => {
//     console.log(err,doc)
// })