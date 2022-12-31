const msgpackr = require('msgpackr');
const { inflate, deflate } = require('pako');
const { fromByteArray, toByteArray } = require('base64-js');

var packer = new msgpackr.Packr();
var enc = packer.pack;
var dec = packer.unpack;

module.exports = {
	encode: function(data) {
		var arrType = new Uint8Array([data[0]]);
		var encodedContent = enc(data[1]);
		var edata = new Uint8Array(encodedContent.length + arrType.length); //creating space
		edata.set(encodedContent, 0);
		edata.set(arrType, encodedContent.length);
		return edata;
	},
	decode: function(data) {
		let packet = new Uint8Array(data);
		let type = packet[packet.length - 1];
		let content = dec(packet.slice(0, packet.length - 1));
		return [type, content];
	},
	compress: function(data) {
		return fromByteArray(deflate(data));
	},
	decompress: function(data) {
		return inflate(toByteArray(data), { to: 'string' });
	}
}
