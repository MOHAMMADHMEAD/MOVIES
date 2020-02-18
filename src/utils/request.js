let _request;

function setRequest(request) {
  _request = request || _request;
}


const parseHeaders = () => _request.headers;
export const headers = parseHeaders;
export const namespace = parseNamespace;

export default setRequest;
