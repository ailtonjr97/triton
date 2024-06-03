function quebraString(str) {
    return str.trimEnd();
}

function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split('/');
    return `${day}/${month}/${year}`;
}

module.exports = {
    quebraString,
    convertDateFormat
};