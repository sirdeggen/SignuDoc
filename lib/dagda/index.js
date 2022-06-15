const REASONABLE_SIZE = 100000 // 100k bytes
const variablesAreNotOfAReasonableSize = variables => {
    return JSON.stringify(variables).length > REASONABLE_SIZE
}

export default class DagdaClient {
    constructor({
        userID,
        bearerToken,
        authorityID,
        apiBaseUrl = 'https://dagda.app',
        testnet = false,
        debug = false,
    }) {
        if (!userID)
            throw Error(
                'Must include both a userID and token when creating a new Dagda Client. Expected: new DagdaClient({ userID, token })'
            )
        if (!apiBaseUrl) console.warn('Using default endpoints at https://elas.dev as no { apiBaseUrl } was provided.')
        this.userID = userID
        this.bearerToken = bearerToken
        this.apiBaseUrl = apiBaseUrl
        this.authorityID = authorityID
        this.testnet = testnet
        this.debug = debug
    }

    async post(path = '', body = {}) {
        return await (
            await fetch(this.apiBaseUrl + path, {
                method: 'POST',
                body: JSON.stringify({
                    userID: this.userID,
                    testnet: this.testnet,
                    ...body,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.bearerToken,
                },
            })
        ).json()
    }

    setTestnet(testnet) {
        this.testnet = testnet
    }

    /**
     *
     * @param profile
     * @param members
     * @param threshold
     * @returns {Promise<Error|{error}>}
     */
    async createAuthority({ profile, members = [{ userID: this.userID }], threshold = 1 }) {
        try {
            if (variablesAreNotOfAReasonableSize({ profile, members, threshold }))
                return Error('Variables are not of a reasonable size, { profile, members, threshold }')
            const response = await this.post('/api/v1/authorities/create', {
                data: {
                    ...profile,
                },
                threshold,
                members,
            })
            if (this.debug) console.log({ response })
            this.authorityID = response?.authorityID
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param authorityID
     * @param updates
     * @returns {Promise<Error|{error}>}
     */
    async updateAuthority({ authorityID, updates }) {
        try {
            if (variablesAreNotOfAReasonableSize({ updates }))
                return Error('Variables are not of a reasonable size, { updates }')
            const response = await this.post('/api/v1/authorities/update/' + authorityID, {
                action: 'update',
                updates,
            })
            if (this.debug) console.log({ response })
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @returns {Promise<any|{error}>}
     */
    async listAuthorities() {
        try {
            const response = await this.post('/api/v1/authorities/list')
            if (this.debug) console.log({ response })
            if (response?.error) return { error }
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @returns {Promise<any|{error}>}
     */
    async listNodes(parent) {
        try {
            const response = await this.post('/api/v1/nodes/list', { parent })
            if (this.debug) console.log({ response })
            if (response?.error) return { error }
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param nodeAddress
     * @returns {Promise<any|{error}>}
     */
    async getAncestors({ nodeAddress }) {
        try {
            const response = await this.post('/api/v1/nodes/ancestors', { nodeAddress })
            if (this.debug) console.log({ response })
            if (response?.error) return { error }
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    async setAuthority({ authorityID }) {
        try {
            const { authorities, error } = await this.listAuthorities()
            if (error || !authorities.includes(authorityID)) {
                if (this.debug) console.log({ error })
                return { error }
            }
            this.authorityID = authorityID
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param authorityID
     * @param data
     * @param name
     * @returns {Promise<{error}|Error|any>}
     */
    async createRoot({ authorityID = this.authorityID, data, name }) {
        try {
            if (variablesAreNotOfAReasonableSize({ data, name }))
                return Error('Variables are not of a reasonable size, { data, name }')
            const response = await this.post('/api/v1/nodes/create', {
                authorityID,
                name,
                data,
            })
            if (this.debug) console.log({ response })
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param authorityID
     * @param name
     * @param data
     * @param outputs
     * @param parent
     * @returns {Promise<{error}|Error|any>}
     */
    async createNode({ authorityID = this.authorityID, name, data, outputs, parent }) {
        try {
            if (variablesAreNotOfAReasonableSize({ data, name }))
                return Error('Variables are not of a reasonable size, { data, name }')
            if (!!outputs && (outputs.length > 1000 || !!outputs.find(o => o.script.length > REASONABLE_SIZE)))
                return Error('Please limit outputs to 1000 max per node, and no more than 100kb each.')
            const response = await this.post('/api/v1/nodes/create', {
                authorityID,
                name,
                data,
                outputs,
                parent,
            })
            if (this.debug) console.log({ response })
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param authorityID
     * @param nodeAddress
     * @returns {Promise<{error}|Error|any>}
     */
    async signNode({ authorityID = this.authorityID, nodeAddress }) {
        try {
            if (!nodeAddress) return Error('You must sign a particular { nodeAddress }')
            const response = await this.post('/api/v1/nodes/sign', {
                authorityID,
                nodeAddress,
            })
            if (this.debug) console.log({ response })
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }

    /**
     *
     * @param nodeAddress
     * @param name
     * @param data
     * @param outputs
     * @returns {Promise<{error}|Error|any>}
     */
    async updateNode({ nodeAddress, name, data, outputs }) {
        try {
            if (this.debug) console.log({ nodeAddress, name, data, outputs })
            if (!nodeAddress) return Error('You must update a particular { nodeAddress }')
            if (variablesAreNotOfAReasonableSize({ data, name }))
                return Error('Variables are not of a reasonable size, { data, name }')
            if (!!outputs && (outputs.length > 1000 || !!outputs.find(o => o.script.length > REASONABLE_SIZE)))
                return Error('Please limit outputs to 1000 max per node, and no more than 100kb each.')
            const response = await this.post('/api/v1/nodes/update', {
                nodeAddress,
                name,
                data,
                outputs,
            })
            if (this.debug) console.log({ response })
            return response
        } catch (error) {
            if (this.debug) console.log({ error })
            return { error }
        }
    }
}
