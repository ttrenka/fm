/********************************************************************************
	File: 		System/Cryptography.js
	Version: 	1.0.0
	Date:		2003-12-15

	f(m) Base Class Library
	A ECMAScript library to serve as the foundation 
	for ECMAScript-hosted application development.
	Copyright (C) 2003 Thomas R. Trenka, Ph.D.

	This library is free software; you can redistribute it and/or
	modify it under the terms of the GNU Lesser General Public
	License as published by the Free Software Foundation; either
	version 2.1 of the License, or any later version.

	This library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
	Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public
	License along with this library; if not, write to the Free Software
	Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

	Cryptography namespace.  Includes adaptations of the following:
		MD5 Encryption:  	(c) Paul Johnston, 1999 - 2002  http://pajhome.org.uk
		SHA1 Encryption: 	(c) Paul Johnston, 1999 - 2002  http://pajhome.org.uk
			(Additional information, Branden J. Hall, Fig Leaf Software
		RipeMD-160:			Jani Nurminen, jnurmine at lut.fi
		Rijndael AES:		(c) 2001 Fritz Schneider, fritz at cs.ucsd.edu
		DES & TripleDES:	(c) 2001 Paul Tero, http://www.shopable.co.uk
			Optimized by Michael Hayworth, http://www.netdealing.com
**********************************************************************************/
Import("System.Convert") ;

//	Guid generator, included here because of the need for the MD5Provider
var Guid = {
	NewGuid : function(seed) {
		var t = new Date().getTime * 1000 ;
		var r = Math.random() * Math.pow(10, 18) ;
		var a = Math.random() * Math.pow(10, 18) ;	//	probably not going to have the network address, oh well
		var data = String(t) + ' ' + String(r) + ' ' + string(a) + (seed ? ' ' + seed : '') ;
		return ((new Cryptography.MD5Provider()).ComputeHash(data)).join("-") ;
	}
} ;

var Cryptography = {} ;

//	Interfaces
Cryptography.IAsymmetricProvider = function(){
	this.ComputeHash = function() { } ;
} ;
Cryptography.ISymmetricProvider = function() {
	this.Decrypt = function() { } ;
	this.Encrypt = function() { } ;
} ;
Cryptography.CipherMode = { CBC:0, CFB:1, CTS:2, ECB:3, OFB:4 } ;

Cryptography.MD5Provider = function() {
	Cryptography.IAsymmetricProvider.call(this) ;
	var chrsz = 8 ;
	function md5_cmn(q, a, b, x, s, t){ return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b); }
	function md5_ff(a, b, c, d, x, s, t){ return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }
	function md5_gg(a, b, c, d, x, s, t){ return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }
	function md5_hh(a, b, c, d, x, s, t){ return md5_cmn(b ^ c ^ d, a, b, x, s, t); }
	function md5_ii(a, b, c, d, x, s, t){ return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }
	function safe_add(x, y) {
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF) ;
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16) ;
	  return (msw << 16) | (lsw & 0xFFFF) ;
	}
	function bit_rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }

	this.ComputeHash = function(x, len) {
		if (!x) throw new ArgumentException("Cryptography.MD5Provider.ComputeHash(): no arguments passed.") ;
		if (x.IsInstanceOf(Array) && isNaN(x[0])) throw new ArgumentException("Cryptography.MD5Provider.ComputeHash(): Array passed is not a byte array.") ; 
		if (x.IsInstanceOf(String)) x = Convert.ToByteArray(x) ;
		if (!len) var len = x.length ;

		x[len >> 5] |= 0x80 << ((len) % 32) ;
		x[(((len + 64) >>> 9) << 4) + 14] = len ;
		var a =  1732584193 ;
		var b = -271733879 ;
		var c = -1732584194 ;
		var d =  271733878 ;
		for (var i = 0; i < x.length; i += 16) {
			var olda = a ;
			var oldb = b ;
			var oldc = c ;
			var oldd = d ;

			a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936) ;
			d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586) ;
			c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819) ;
			b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330) ;
			a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897) ;
			d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426) ;
			c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341) ;
			b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983) ;
			a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416) ;
			d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417) ;
			c = md5_ff(c, d, a, b, x[i+10], 17, -42063) ;
			b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162) ;
			a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682) ;
			d = md5_ff(d, a, b, c, x[i+13], 12, -40341101) ;
			c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290) ;
			b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329) ;

			a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510) ;
			d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632) ;
			c = md5_gg(c, d, a, b, x[i+11], 14,  643717713) ;
			b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302) ;
			a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691) ;
			d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083) ;
			c = md5_gg(c, d, a, b, x[i+15], 14, -660478335) ;
			b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848) ;
			a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438) ;
			d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690) ;
			c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961) ;
			b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501) ;
			a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467) ;
			d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784) ;
			c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473) ;
			b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734) ;

			a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558) ;
			d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463) ;
			c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562) ;
			b = md5_hh(b, c, d, a, x[i+14], 23, -35309556) ;
			a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060) ;
			d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353) ;
			c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632) ;
			b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640) ;
			a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174) ;
			d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222) ;
			c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979) ;
			b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189) ;
			a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487) ;
			d = md5_hh(d, a, b, c, x[i+12], 11, -421815835) ;
			c = md5_hh(c, d, a, b, x[i+15], 16,  530742520) ;
			b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651) ;

			a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844) ;
			d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415) ;
			c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905) ;
			b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055) ;
			a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571) ;
			d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606) ;
			c = md5_ii(c, d, a, b, x[i+10], 15, -1051523) ;
			b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799) ;
			a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359) ;
			d = md5_ii(d, a, b, c, x[i+15], 10, -30611744) ;
			c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380) ;
			b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649) ;
			a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070) ;
			d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379) ;
			c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259) ;
			b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551) ;

			a = safe_add(a, olda) ;
			b = safe_add(b, oldb) ;
			c = safe_add(c, oldc) ;
			d = safe_add(d, oldd) ;
		}
		return Array(a, b, c, d) ;
	} ;
} ;