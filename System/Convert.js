/********************************************************************************
	File: 		System/Convert.js
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

	Convert object.  Includes static methods for converting strings
		to stream-based objects, including Base64, BinHex and ByteArrays.
**********************************************************************************/
var Convert = {
	ToBase64 : function(data) {
		if (typeof(data) == "string") data = Convert.ToByteArray(data) ;
		var base64Enc = [
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
			'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
			'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
			'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
			'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
			'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
			'w', 'x', 'y', 'z', '0', '1', '2', '3',
			'4', '5', '6', '7', '8', '9', '+', '/', 
			'='
		];
		var PADDING_CHAR = 64;		// index of padding char
		var output = [] ;			// total output
		var oc = 0;					// index accumulator for output
		var len	= data.length;
		for (var i = 0; i < len; /* nothing */ ) {
			var now  = data[i++] << 16;	
			now |= data[i++] << 8;	
			now |= data[i++];	
			output[oc++] = base64Enc[now >>> 18 & 63]; 	// 23..18
			output[oc++] = base64Enc[now >>> 12 & 63]; 	// 17..12
			output[oc++] = base64Enc[now >>> 6  & 63]; 	// 11..6
			output[oc++] = base64Enc[now        & 63]; 	// 5..0
		}
		var padAmount = i - len;
		if (padAmount > 0)  oc -= padAmount; 
		padAmount = Math.abs(padAmount);	// how much to pad
		while (padAmount-- > 0) output[oc++] = base64Enc[PADDING_CHAR];
		return output.join("");
	} ,
	FromBase64 : function(data) {
		if (typeof(data) == "string") data = data.split("") ;
		var base64Dec = {
			'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7,
			 'I': 8, 'J': 9, 'K':10, 'L':11, 'M':12, 'N':13, 'O':14, 'P':15,
			 'Q':16, 'R':17, 'S':18, 'T':19, 'U':20, 'V':21, 'W':22, 'X':23,
			 'Y':24, 'Z':25, 'a':26, 'b':27, 'c':28, 'd':29, 'e':30, 'f':31,
			 'g':32, 'h':33, 'i':34, 'j':35, 'k':36, 'l':37, 'm':38, 'n':39,
			 'o':40, 'p':41, 'q':42, 'r':43, 's':44, 't':45, 'u':46, 'v':47,
			 'w':48, 'x':49, 'y':50, 'z':51, '0':52, '1':53, '2':54, '3':55,
			 '4':56, '5':57, '6':58, '7':59, '8':60, '9':61, '+':62, '/':63,
			 '=':64
		};

		var PADDING_CHAR = 64;		// index of padding char
		var output = [] ;			// total output
		var oc = 0;					// index accumulator for input
		var len = data.length;		// 0..len-1

		while (data[--len] == base64Dec[PADDING_CHAR]) { /* nothing */ };
		for (var i = 0; i < len; /* nothing */ ) {	
			var now = base64Dec[data[i++]] << 18;	// 23..18
			now    |= base64Dec[data[i++]] << 12;	// 17..12
			now    |= base64Dec[data[i++]] << 6;	// 11..5
			now    |= base64Dec[data[i++]];		// 5..0

			output[oc++] = now >>> 16 & 255; 	// 23..16
			output[oc++] = now >>> 8  & 255; 	// 15..8
			output[oc++] = now        & 255; 	// 7..0
		}
		return output ;
	} ,
	ToBinHex : function(ba) {
		if (ba.IsInstanceOf(String)) 
			ba = Convert.ToByteArray(ba) ;
		var hex_tab = "0123456789abcdef";
		var s = "";
		for (var i = 0; i < ba.length * 4; i++) 
			s += hex_tab.charAt((ba[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((ba[i>>2] >> ((i%4)*8)) & 0xF) ;
		return s;
	} ,
	ToByteArray : function(s) {
		var chrsz = 8 ;
		var bin = [] ;
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < s.length * chrsz; i += chrsz) 
			bin[i>>5] |= (s.charCodeAt(i/chrsz) & mask) << (i%32) ;
		return bin;
	} ,
	FromByteArray : function(ba) {
		var chrsz = 8 ;
		var s = "" ;
		var mask = (1 << chrsz) - 1 ;
		for (var i = 0; i < ba.length * 32; i += chrsz) 
			s += String.fromCharCode((ba[i>>5] >>> (i % 32)) & mask) ;
		return s ;
	}
} ;
