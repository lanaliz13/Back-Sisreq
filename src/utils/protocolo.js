function gerarProtocolo() {
  return `REQ-${Date.now()}`;
}

module.exports = gerarProtocolo;