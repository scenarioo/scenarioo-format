# Scenarioo Documentation Format - Reference Example

This reference example directory contains an example of a scenarioo documentation directory file structure as it should be producable by all libraries that support writing this format.

All libraries that implement a Scenarioo Writer should implement some tests to verify that all these same files with exactly same content and in same file structure can be produced easily by using these libraries. A library is considered feature complete, if, and only if, it can produce this same output.

When we change or add features in the scenarioo format, we will adopt this reference example, such that it should allways contain all possibilities that need to be tested and supported by all the libraries.

Improtant explanation about structure of the example: 
* `example-branch`: this example branch contains objects for each entity type with all data (at least each field once) that needs to be writable by a library.
* `example-branch-minimal`: this example branch contains objects for each entity type in a minimal version with only the required fields, to verify that a library does not expect the user to set more data than realy needed.

The same example will also be used in unit tests for the server to verify it can read this example properly.
