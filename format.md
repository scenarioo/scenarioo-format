# Scenarioo file format and folder structure

This is the specification of the Scenarioo documentation format. To find out more about Scenarioo please visit [www.scenarioo.org](http://www.scenarioo.org).

WARNING: This file format is not used in current versions of Scenarioo 2.x. It is the future format for Scenarioo 3.x. For a reference of the Scenarioo 2.x format, please have a look in our [Wiki](https://github.com/scenarioo/scenarioo/wiki/Scenarioo-Writer-Documentation-Format).

# General rules

* Whenever we talk about URL encoding here, we use the `+` sign to encode a space character instead of `%20`.
* For a description of the JSON format, see http://json.org
* Some fields are considered `identifiers` and must conform to the [Safe Identifiers](Safe Identifiers) rules. -> TODO: Specify here
* [Labels](Labels) -> TODO: Specify here
* [Details](Details) -> TODO: Specify here

# Domain model

![Scenarioo Domain Model](images/draw.io/Scenarioo Domain Model.png)

# File System Structure

TODO: Draw a new diagram using draw.io, also commit the draw.io source of the diagram as well as the png image.

Scenarioo documentation data is stored in a certain structure of folders and files. The image below illustrates this. The folder structure reflects the domain model of Scenarioo (see previous chapter).

![Scenarioo File System Structure](https://cloud.githubusercontent.com/assets/5416988/3470838/f6fab378-02bd-11e4-8405-06d4d89c90a3.jpg)

# Folders

## Documentation Root Folder

This is the folder where all the Scenarioo documentation files and folders are stored. Typically it contains a number of branch folders.


## Branch Folder and branch.json

### Purpose

Scenarioo allows to document several branches of your applications. You can use this to document co-existing branches and also to document different versions of your software. In most projects where we use Scenarioo so far, we document each version of our software as a separate branch. Usually this corresponds to a branch in our version control system.

### Rules

* A folder in the *documentation root* is a *branch folder* if and only if it also contains a valid `branch.json` file.
* The folder name of a *branch folder* must be the URL encoded version of the `name` value in the `branch.json`. If this is not the case, the folder is not considered a *branch folder*. 
* It is allowed to have other folders that are not *branch folders* in the *documentation root*. They are ignored by Scenarioo.

### Values

* Mandatory values in `branch.json`:
  * `name`, `String`: Use something that identifies your branch or your software version, e.g. "Release 2014-10-25", "Version 3.1", "trunk" or "123-some-super-new-feature".
* Optional values:
  * `description`, `String`: A short description of the purpose of this branch, what version of your application does this branch contain or document.
  * `details`, `Object`: Whatever additional information you would like to attach to the branch object.

### Example branch.json file

```
{
	"branch" : {
		"name" : "develop branch",
		"description" : "Here we integrate all the cool features for the next release.",
		"details" : {
			"branch creation date" : "...",
			"authors" : [
				"homer", "marge", "bart", "lisa", "maggie"
			]
		}
	}
}
```


## Build Folder and build.json

### Purpose

You probably want to run a regular build for generating the documentation data. For this purpose, each branch is structured in a number of builds. Each run of all your tests and a belonging fully generated scenarioo documentation of your application is called a *build*.

### Rules

* A *build folder* is a folder inside a *branch folder* if and only if it contains a valid `build.json` file.
* The folder name of a *build folder* must be the URL encoded version of the `name` value in the `build.json`. If this is not the case, the folder is not considered a *build folder*. 
* It is allowed to have other folders that are not *build folders* in a *branch folder*. They are ignored by Scenarioo.

### Values

* Mandatory values:
  * `name`, `String`: Use something that reflects the uniqueness and order of your builds, e.g. the timestamp or a build sequence number.
  * `date`, restricted `String`: Start date / time of the build (as a timestamp) --> TODO: Specify exact format
* Important optional values:
  * `revision`, `String`: the revision number in your version control system (e.g. changeset number).
  * `status`, `String`: Whether the build was a `success` or `failed`. If the status is left empty, Scenarioo will calculate it from the states of contained use cases and their scenarios. Scenarioo by default (if not configured otherwise) only supports "failed" and "success" as known status values. All other status values are treated as not successful and displayed in orange.
* Optional values:
  * `details`, `Object`: Whatever additional information you would like to attach to the build object.

### Example build.json file

```
{
	"build" : {
		"name" : "2014-01-20",
		"revision" : "1290FE2",
		"date" : "2014-01-20T00:00:00+01:00",
		"status" : "success",
		"details" {
			"build trigger" : "manual",
			"build run duration" : "14 minutes"
		}
	}
}
```


### Use Case Folder and usecase.json

TODO: Add specification


### Scenario Folder and scenario.json

TODO: Add specification


### Steps of a scenarioo and <stepnumber>.json

TODO: Add specification
