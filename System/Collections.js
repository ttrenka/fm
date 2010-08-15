/********************************************************************************
	File: 		Collections.js
	Version: 	1.0.0
	Date:		2003-07-03

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

	Partial implementation of the System.Collections namespace
	in .NET.  The Following have not, and will not, be implemented:
	ArrayList, BitArray, ...Provider, ...CollectionBase,
	DictionaryBase, ICollection, IEnumerator, IList. Note that IList
	is for the most part implemented as native methods of the Array
	object (see extensions.js).

	They will not be implemented simply because JS arrays are
	not fixed length, and most of those collections are mechanisms
	implementing dynamically allocated arrays.

	Please note that not all properties and methods of the .NET
	version have been implemented either; in general these have
	been dropped because of the mechanics of the Javascript lang
	(for instance, .SyncRoot has no meaning in JS).

	The Enumerator class will enumerate on any array,
	DictionaryEnumerator will enumerate on any class that implements IDictionary.
**********************************************************************************/
var Collections = {} ;
Collections.DictionaryEntry = function(k, v) {
	this.Key = k ;
	this.Value = v ;
} ;

//	For Collections that store thier stuff internally as an array
Collections.Enumerator = function(arr) {
	var o = arr ;
	var position = 0 ;
	this.Current = null ;
	this.AtEnd = false ;
	this.MoveNext = function() {
		if (this.AtEnd) return !this.AtEnd ;
		this.Current = o[position] ;
		if (position == o.length) this.AtEnd = true ;
		position++ ;
		return !this.AtEnd ;
	}
	this.Reset = function() { 
		position = 0 ; 
		this.AtEnd = false ;
	} ;
} ;
//	For Collections that store thier stuff internally as a hashtable
Collections.DictionaryEnumerator = function(obj) {
	var o = [] ;	//	Create an indexing array
	for (var p in obj) o[o.length] = obj[p] ;	//	fill it up
	var position = 0 ;
	this.Current = null ;
	this.Entry = null ;
	this.Key = null ;
	this.Value = null ;
	this.AtEnd = false ;
	this.MoveNext = function() { 
		if (this.AtEnd) return !this.AtEnd ;
		this.Entry = this.Current = o[position] ;
		if (this.Entry) {
			this.Key = this.Entry.Key ;
			this.Value = this.Entry.Value ;
		}
		if (position == o.length) this.AtEnd = true ;
		position++ ;
		return !this.AtEnd ;
	} ;
	this.Reset = function() { 
		position = 0 ; 
		this.AtEnd = false ;
	} ;
} ;

//	Interfaces.
Collections.IEnumerable = function() { this.GetEnumerator = function() { return null ; } ; } ;
Collections.IDictionary = function() {
	Collections.IEnumerable.call(this) ;
	this.Item = function(k){ } ;
	this.Add = function(o){ } ;
	this.Clear = function(){ } ;
	this.Contains = function(o){ } ;
	this.Remove = function(o){ } ;
} ;

//	Collection objects.
Collections.Hashtable = function() {
	Collections.IDictionary.call(this) ;
	var items = {} ;
	this.Count = 0 ;

	this.Add = function(k,v) { 
		items[k] = new Collections.DictionaryEntry(k, v) ; 
		this.Count++ ;
	} ;
	this.Clear = function() {
		items = {} ;
		this.Count = 0 ;
	} ;
	this.Clone = function() {
		var ht = new Collections.Hashtable() ;
		for (var p in items) ht.Add(items[p].Key, items[p].Value) ;
		return ht ;
	} ;
	this.Contains = function(k) { return (items[k] ? true : false) ; } ;
	this.ContainsKey = function(k) { return this.Contains(k) ; } ;
	this.ContainsValue = function(v) {
		var e = this.GetEnumerator() ;
		while (e.MoveNext()) 
			if (e.Value == v) return true ;
		return false ;
	} ;
	this.Item = function(k) { return items[k] ; } ;
	this.GetEnumerator = function() { return new Collections.DictionaryEnumerator(items) ; } ;
	this.Remove = function(k) {
		delete items[k] ;
		this.Count-- ;
	} ;
} ;
Collections.Queue = function(arr) {
	var q = [] ; //	the internal queue
	if (arr && arr.IsInstanceOf(Array)) q = q.concat(arr) ;
	this.Count = q.length ;	
	this.Clear = function() {
		q = [] ;
		this.Count = q.length ;
	} ;
	this.Clone = function() { return new Collections.Queue(q) ; } ;
	this.Contains = function(o) {
		for (var i = 0; i < q.length; i++) {
			if (q[i] == o) return true ;
		}
		return false ;
	} ;
	this.CopyTo = function(arr, i) { arr.splice(i,0,q) ; } ;
	this.Dequeue = function() {
		var r = q.shift() ;
		this.Count = q.length ;
		return r ;
	} ;
	this.Enqueue = function(o) { this.Count = q.push(o) ; } ;
	this.GetEnumerator = function() { return new Collections.Enumerator(q) ; } ;
	this.Peek = function() { return q[0] ; } ;
	this.ToArray = function() { return [].concat(q) ; } ;
} ;
Collections.SortedList = function(dictionary) {
	Collections.IDictionary.call(this) ;
	var items = { } ;	//	The internal hash reference
	var q = [] ;		//	The sorted references
	var sorter = function(a,b) {
		if (a.Key > b.Key) return 1 ;
		if (a.Key < b.Key) return -1 ;
		return 0 ;
	} ;
	var build = function() {
		var e = this.GetEnumerator() ;
		while (e.MoveNext()) q[q.length] = e.Entry ;
		q.sort(sorter) ;
	} ;

	//	Fill the SortedList if a Dictionary was passed.
	if (dictionary){
		if (!dictionary.Implements(IDictionary)) throw new Exception("Collections.SortedList(): passed argument is not an IDictionary object.") ;
		var e = dictionary.GetEnumerator() ;
		while (e.MoveNext()) q[q.length] = items[e.Entry.Key] = new Collections.DictionaryEntry(e.Entry.Key, e.Entry.Value) ;
		q.sort(sorter) ;
	}
	this.Count = q.length ;

	this.Add = function(k, v) { 
		if (!items[k]) {
			items[k] = new DictionaryEntry(k, v) ;
			this.Count = q.push(items[k]) ;
			q.sort(sorter) ;
		}
	} ;
	this.Clear = function() { 
		items = {} ;
		q = [] ;
		this.Count = q.length ;
	} ;
	this.Clone = function() { return new Collections.SortedList(this) ; } ;
	this.Contains = this.ContainsKey = function(k) { 
		if (items[k]) return true ;
		return false ;
	} ;
	this.ContainsValue = function(o) { 
		var e = this.GetEnumerator() ;
		while(e.MoveNext()) {
			if (e.Entry.Value == o) return true ;
		}
		return false ;
	} ;
	this.CopyTo = function(arr, i) { 
		var e = this.GetEnumerator() ;
		var idx = i ;
		while(e.MoveNext()) {
			arr.splice(idx, 0, e.Entry) ;
			idx++ ;
		}
	} ;
	this.GetByIndex = function(i) { return q[i].Value ; } ;
	this.GetEnumerator = function() { return new Collections.DictionaryEnumerator(items) ; } ;
	this.GetKey = function(i) { return q[i].Key ; } ;
	this.GetKeyList = function() { 
		var arr = [] ;
		var e = this.GetEnumerator() ;
		while(e.MoveNext()) arr.push(e.Entry.Key) ;
		return arr ;
	} ;
	this.GetValueList = function() { 
		var arr = [] ;
		var e = this.GetEnumerator() ;
		while(e.MoveNext()) arr.push(e.Entry.Value) ;
		return arr ;
	} ;
	this.IndexOfKey = function(k) { 
		for (var i = 0; i < q.length; i++) {
			if (q[i].Key == k) return i ;
		}
		return -1 ;
	} ;
	this.IndexOfValue = function(o) { 
		for (var i = 0; i < q.length; i++) {
			if (q[i].Value == o) return i ;
		}
		return -1 ;
	} ;
	this.Item = function(k) { return items[k] ; } ;
	this.Remove = function(k) { 
		delete items[k] ;
		build() ;
		this.Count = q.length ;
	} ;
	this.RemoveAt = function(i) { 
		delete items[q[i].Key] ;
		build() ;
		this.Count = q.length ;
	} ;
	this.SetByIndex = function(i, o) { items[q[i].Key] = o ; } ;
} ;
Collections.Stack = function(arr) {
	var q = [] ; //	the internal stack
	if (arr && arr.IsInstanceOf(Array)) q = q.concat(arr) ;
	this.Count = q.length ;	
	this.Clear = function() {
		q = [] ;
		this.Count = q.length ;
	} ;
	this.Clone = function() { return new Collections.Stack(q) ; } ;
	this.Contains = function(o) {
		for (var i = 0; i < q.length; i++) {
			if (q[i] == o) return true ;
		}
		return false ;
	} ;
	this.CopyTo = function(arr, i) { arr.splice(i,0,q) ; } ;
	this.Pop = function() {
		var r = q.pop() ;
		this.Count = q.length ;
		return r ;
	} ;
	this.Push = function(o) { this.Count = q.push(o) ; } ;
	this.GetEnumerator = function() { return new Collections.Enumerator(q) ; } ;
	this.Peek = function() { return q[(q.length - 1)] ; } ;
	this.ToArray = function() { return [].concat(q) ; } ;
} ;
