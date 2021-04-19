const Qrterminal = require("qrcode-terminal");
module.exports = function onScan(qrcode, status, data) {
    Qrterminal.generate(qrcode, { small: true }, function(qrcode){})
}