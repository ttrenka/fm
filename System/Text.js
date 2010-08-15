/********************************************************************************
	File: 		System/Text.js
	Version: 	1.0.0
	Date:		2003-08-24

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

	StringBuilder class implementation.  Includes most methods present in the
		.NET version.
**********************************************************************************/
var Text = { } ;
Text.StringBuilder = function(str) {
	var arr = new Array() ;
	var buffer = (str)?str:"" ;
	var length = this.Length = buffer.length ;
	if (!buffer.IsEmpty()) arr.push(buffer) ;
	buffer = "" ;

	this.toString = this.ToString = function() { return arr.join(""); } ;
	this.Append = function(s) { 
		arr.push(s) ;
		length += s.length ;
		this.Length = length ;
	}
	this.Clear = function() {
		arr = new Array() ;
		length = this.Length = 0 ;
	} ;
	this.Remove = function(from, len) {
		if ((from + len) > length || from < 0 || len < 0)
			throw new Exception("Text.StringBuilder.Remove(" + from + ", " + len + "): Arguments out of range.") ;
		var s = "" ;
		buffer = arr.join("") ;
		arr = new Array() ;
		if (from > 0) s = buffer.substring(0, (from - 1)) ;
		buffer = s + buffer.substring(from + len) ;
		arr.push(buffer) ;
		length = this.Length = buffer.length ;
		buffer = "" ;
	} ;
	this.Replace = function(oldString, newString) { 
		if (!oldString) throw new Exception("Text.StringBuilder.Replace('" + oldString + "', '" + newString + "'): string to replace is null.") ;
		if (oldString.length == 0) throw new Exception("Text.StringBuilder.Replace('" + oldString + "', '" + newString + "'): string to replace is an empty string.") ;
		buffer = arr.join("") ;
		arr = new Array() ;
		buffer.replace(oldString, newString) ;
		arr.push(buffer) ;
		length = this.Length = buffer.length ;
		buffer = "" ;
	} ;
	this.Insert = function(idx, s) { 
		if (!s) throw new Exception("Text.StringBuilder.Insert('" + idx + "', '" + s + "'): string to insert is null.") ;
		buffer = arr.join("") ;
		arr = new Array() ;
		if (idx < 0 || idx > buffer.length) throw new Exception("Text.StringBuilder.Insert('" + idx + "', '" + s + "'): index is out of range.") ;
		if (idx == 0) buffer = s + buffer ;
		else {
			var start = buffer.substring(0, idx - 1) ;
			var end = buffer.substring(idx) ;
			buffer = start + s + end ;
		}
		length = this.Length = buffer.length ;
		arr.push(buffer) ;
		buffer = "" ;
	} ;
} ;
