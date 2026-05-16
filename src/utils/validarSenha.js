function validarSenhaForte(senha) {
  const senhaForte =
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha);

  return senhaForte;
}

module.exports = validarSenhaForte;