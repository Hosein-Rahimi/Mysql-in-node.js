const axios = require("axios");

class WebService {

    method = "get";
    url;
    baseUrl;
    statusCode;
    body;
    params;
    headers;
    result;

    getMethod() {
        return this.method;
    }
    setMethod(method) {
        this.method = method;
        return this;
    }
    getUrl() {
        return this.url;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }
    getStatusCode() {
        return this.statusCode;
    }
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
    getBody() {
        return this.body;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    getParams() {
        return this.params;
    }
    setParams(params) {
        this.params = params;
        return this;
    }
    getHeaders() {
        return this.headers;
    }
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }
    getResult() {
        return this.result;
    }
    setResult(result) {
        this.result = result;
        return this;
    }

    async send() {
        await axios({
            method: this.getMethod(),
            url: this.getUrl(),
            data: this.getBody(),
            headers: this.getHeaders(),
            params: this.getParams(),
        }).then((response) => {
            this.setStatusCode(200);
            this.setResult(response.data);
        })
            .catch((error) => {
                this.setStatusCode(500);
                this.setResult(error)
            })
    }


}
module.exports = WebService;
