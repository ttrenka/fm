/********************************************************************************
	File: 		System/io.js
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

	IO Namespace.  Includes basic (very) implementations of Stream, StreamReader
		and StreamWriter.  Used primarily with Cryptography, although it is in
		a separate space so it can be used for other purposes.

	Note that this version does not implement buffered streaming.
**********************************************************************************/
Import("System.Convert") ;

function ObjectDisposedException = function(msg) { Exception.call(this, msg) ; } ;
ObjectDisposedException.prototype = new Exception ;
ObjectDisposedException.prototype.constructor = ObjectDisposedException ;

var IO = {} ;
IO.SeekOrigin = { Begin : 0, Current : 1, End : 2 } ;
IO.Stream = function(buf) {
	var ba = [] ;
	var isClosed = false ;
	if (buf) {
		if (buf.IsInstanceOf(Array)) ba = [].concat(buf) ;
		else if (buf.IsInstanceOf(String)) ba = [].concat(Convert.ToByteArray(buf)) ;
		throw new ArgumentException("IO.Stream: argument passed is not a byte array or string.") ;
	}

	this.Length = ba.length ;
	this.Position = -1 ;
	this.Close = function() {
		ba = null ; 
		isClosed = true ; 
	} ;
	this.Read = function(buffer, offset, count) {
		if (isClosed) throw new ObjectDisposedException("IO.Stream.Read: the underlying stream has been closed.") ;
		if (offset + count > ba.length) throw new ArgumentException("IO.Stream.Read: Offset + Count > internal buffer's length.") ;
		if (offset < 0 || count < 0) throw new ArgumentException("IO.Stream.Read: Offset and Count must be > 0.") ;
		if (this.Position >= ba.length) return -1 ;
		for (var i = 0; i < count; i++) {
			if (this.Position >= ba.length) break ;
			buffer[(i + offset)] = ba[++this.Position] ;
		}
		return i ;
	} ;
	this.ReadByte = function() {
		if (isClosed) throw new ObjectDisposedException("IO.Stream.ReadByte: the underlying stream has been closed.") ;
		if (this.Position >= ba.length) return -1 ;
		return ba[++this.Position] ;
	} ;
	this.Seek = function(offset, seekOrigin) {
		switch(seekOrigin) {
			case IO.SeekOrigin.Begin : { this.Position = offset ; break ; }
			case IO.SeekOrigin.Current : { this.Position = this.Position + offset ; break ; }
			case IO.SeekOrigin.End : { this.Position = ba.length + offset ; break ; }
		}
		return this.Position ;
	} ;
	this.Write = function(buffer, offset, count) {
		for (var i = 0; i < count; i++) {
			if (i + offset > buffer.length) break ;
			ba.push(buffer[i + offset]) ;
			this.Position++ ;
		}
		this.Length = ba.length ;
	} ;
	this.WriteByte = function(val) {
		ba.push(val) ;
		this.Position++ ;
		this.Length = ba.length ;
	} ;
} ;

//	Add buffering to these classes.
IO.StreamReader = function(stream) {
	this.BaseStream = stream ;
	var isClosed = false ;
	this.Close = function() { 
		stream.Close() ;
		stream = this.BaseStream = null ;		//	let go of the stream reference
		isClosed = true ;
	} ;
	this.Peek = function() { return -1; } ;	//	not implemented	
	this.Read = function(buf, index, count) { 
		if (isClosed) throw new ObjectDisposedException("IO.StreamReader.Read: the underlying stream has been closed.") ;
		return stream.Read(buf, index, count) ;
	} ;
	this.ReadToEnd = function() { 
		if (isClosed) throw new ObjectDisposedException("IO.StreamReader.ReadToEnd: the underlying stream has been closed.") ;
		var buf = [] ;
		var count = 32 ;
		var pos = 0 ;
		while (pos >= 0) pos = stream.Read(buf, buf.length, count) ;
		return buf ;
	} ;
} ;

IO.StreamWriter = function(stream) {
	this.BaseStream = (stream) ? stream : new IO.Stream() ;
	this.NewLine = "\n" ;
	var isClosed = false ;
	this.Close = function() { 
		stream.Close() ;
		stream = this.BaseStream = null ;		//	let go of the stream reference
		isClosed = true ;
	} ;
	this.Flush = function() { } ;	//	do nothing for now, not using a true buffer for this.
	this.Write = function(s) { 
		if (isClosed) throw new ObjectDisposedException("IO.StreamWriter.Write: the underlying stream has been closed.") ;
		var ba = Convert.ToByteArray(s) ;
		stream.Write(ba, 0, ba.length) ;
	} ;
	this.WriteLine = function(s) { 
		if (isClosed) throw new ObjectDisposedException("IO.StreamWriter.WriteLine: the underlying stream has been closed.") ;
		this.Write(s + this.NewLine) ;
	} ;
} ;
