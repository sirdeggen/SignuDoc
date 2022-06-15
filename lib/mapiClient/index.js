import { PubKey, Ecdsa, Sig, Hash, Tx } from 'openspv'

class mapiClient {
    /**
     * Instantiates a new MAPI client instance.
     */
    constructor({
        root = 'https://mapi.taal.com/mapi',
        token,
        callbackURL,
        callbackToken,
        callbackEncryption,
        merkleProofsRequired = true,
        merkleProofFormat = 'TSC',
        doubleSpendCheck = true,
    } = {}) {
        this.root = root
        this.token = token
        this.options = {
            callbackUrl: callbackURL,
            callbackToken: callbackToken,
            merkleProof: merkleProofsRequired,
            merkleFormat: merkleProofFormat,
            dsCheck: doubleSpendCheck,
            callbackEncryption,
        }
    }

    async get(path) {
        return await (
            await fetch(this.root + path, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + this.token,
                },
            })
        ).json()
    }

    async post(path, body) {
        return await (
            await fetch(this.root + path, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.token,
                },
            })
        ).json()
    }

    checkSignature(response) {
        if (response?.message) {
            console.log({ checkSignature: response })
            return false
        }
        const payloadHash = Hash.sha256(Buffer.from(response.payload))
        const signature = Sig.fromString(response.signature)
        const publicKey = PubKey.fromString(response.publicKey)
        response.details = JSON.parse(response?.payload || '{}')
        return Ecdsa.verify(payloadHash, signature, publicKey)
    }

    async policyQuote() {
        try {
            const response = await this.get('/policyQuote')
            console.log({ policyQuote: response })
            return response
        } catch (error) {
            console.log({ error })
        }
    }

    async feeQuote() {
        try {
            const response = await this.get('/feeQuote')
            console.log({ feeQuote: response })
            return response
        } catch (error) {
            console.log({ error })
        }
    }

    async txStatus(txid) {
        try {
            const response = await this.get('/tx/' + txid)
            const valid = this.checkSignature(response)
            if (!valid) return { error: 'MAPI signature failed to validate', response }
            console.log({ txStatus: response })
            return response
        } catch (error) {
            console.log({ error })
        }
    }

    async broadcast(rawtx) {
        try {
            const txid = Tx.fromHex(rawtx).id()
            const status = await this.txStatus(txid)
            if (status?.error) return { error: status?.error }
            if (status?.details?.returnResult === 'success') {
                return { txid, ...status }
            }
            const response = await this.post('/tx', {
                rawTx: rawtx,
                ...this.options,
            })
            const valid = this.checkSignature(response)
            if (!valid) return { error: 'MAPI signature failed to validate', response }
            // handle mapi errors and translate them so that we know what to do internally.
            console.log({ broadcast: response })
            if (response?.details?.returnResult !== 'success') return { error: 'Broadcast Failed', response }
            return response
        } catch (error) {
            console.log({ error })
        }
    }

    async broadcastMany(rawtxs) {
        try {
            const response = await this.post(
                '/txs',
                rawtxs?.map(rawTx => ({
                    rawTx,
                    ...this.options,
                })) || []
            )
            const valid = this.checkSignature(response)
            if (!valid) return { error: 'MAPI signature failed to validate', response }
            console.log({ broadcastMany: response })
            return response
        } catch (error) {
            console.log({ error })
        }
    }
}

export default mapiClient
