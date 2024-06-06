function quebraString(str) {
    return str.trimEnd();
}

function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split('/');
    return `${day}/${month}/${year}`;
}

function formatarParaMoedaBrasileira(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = {
    quebraString,
    convertDateFormat,
    formatarParaMoedaBrasileira
};