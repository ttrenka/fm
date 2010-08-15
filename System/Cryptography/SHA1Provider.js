/********************************************************************************
	File: 		System/Cryptography/SHA1Provider.js
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
		SHA1 Encryption: 	(c) Paul Johnston, 1999 - 2002  http://pajhome.org.uk
			(Additional information, Branden J. Hall, Fig Leaf Software
**********************************************************************************/
Import("System.Cryptography") ;
Cryptography.SHA1Provider = function() {
	Cryptography.IAsymmetricProvider.call(this) ;
	var chrsz = 8 ;
	function sha1_ft(t, b, c, d) {
		if(t < 20) return (b & c) | ((~b) & d);
		if(t < 40) return b ^ c ^ d;
		if(t < 60) return (b & c) | (b & d) | (c & d);
		return b ^ c ^ d;
	}
	function sha1_kt(t) { return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 : (t < 60) ? -1894007588 : -899497514 ; }
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }

	this.ComputeHash = function(x, len) {
		if (!x) throw new Error("Cryptography.SHA1Provider.ComputeHash(): no arguments passed.") ;
		if (x.IsInstanceOf(Array) && isNaN(x[0])) throw new Error("Cryptography.SHA1Provider.ComputeHash(): Array passed is not a byte array.") ; 
		if (x.IsInstanceOf(String)) x = Convert.ToByteArray(x) ;
		if (!len) var len = x.length ;

		x[len >> 5] |= 0x80 << (24 - len % 32) ;
		x[((len + 64 >> 9) << 4) + 15] = len ;
		var w = Array(80) ;
		var a =  1732584193 ; var b = -271733879 ; var c = -1732584194 ; var d =  271733878 ; var e = -1009589776 ;
		for (var i = 0; i < x.length; i += 16){
			var olda = a ; var oldb = b ; var oldc = c ; var oldd = d ; var olde = e ;
			for (var j = 0; j < 80; j++){
				if (j < 16) w[j] = x[i + j] ;
				else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1) ;
				var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)))  ;
				e = d ; d = c ; c = rol(b, 30) ; b = a ; a = t ;
			}
			a = safe_add(a, olda) ; b = safe_add(b, oldb) ; c = safe_add(c, oldc) ; d = safe_add(d, oldd) ; e = safe_add(e, olde) ;
		}
		return Array(a, b, c, d, e) ;
	} ;
} ;
