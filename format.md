# Scenarioo Format Specification

This is the specification of the Scenarioo documentation format. To find out more about Scenarioo please visit [www.scenarioo.org](http://www.scenarioo.org).

WARNING: This file format is not used in current versions of Scenarioo 2.x. It is the future format for Scenarioo 3.x. For a reference of the Scenarioo 2.x format, please have a look in our [Wiki](https://github.com/scenarioo/scenarioo/wiki/Scenarioo-Writer-Documentation-Format).

## Domain Model Overview

The following diagram gives a rough overview about the major entities in the scenarioo documentation model:

![Scenarioo Domain Model](images/draw.io/Scenarioo Domain Model.png)


## General rules

* For a description of the JSON format, see http://json.org
* TODO to be defined more?

## Data Types

### <a name="String">String</a>

A regular string as defined by the JSON format, all characters in UTF-8 are allowed.

### <a name="identifier_string">Identifier-Sring</a>

All fields that are used as identifiers and therefore can be part of a URL have this type, and in this kind of string only usual characters are allowed, no spaces, no slashes and not other special characters, except for `-` and `_`.

Regexp: `[A-Za-z_0-9\-]+`

### <a name="Datetime">Datetime</a>

The `Datetime` format used in scenarioo is a usual ISO data time format, as specified here: https://en.wikipedia.org/wiki/ISO_8601

### <a name="labels">Labels</a>

The value of a labels field is an array of labels, each label is a string that has to conform to following regexp.

Regexp: `[ A-Za-z_0-9\-]+`

### <a name="DocuObject">DocuObject</a>

A `DocuObject` is an object that describes any additional generic data value or even more complex data objects.

`DocuObject`s are very powerful and can be used to model arbitrary application specific data structures.

Each `DocuObject` consists of following fields:

Name | Type / Format | Description | Rules
:---|:---|:---|:---
labelKey | [String](#String) | Kind of the identifier (key) and the label text for the property or the relation to an item. Can be used for configuration purpose, e.g. to select some special property values to display in some special views e.g. as table columns. And this field is special since it does not realy belong to the information value object, meaning, that same object value, even typed value, can occur with multiple different label keys of course. | For objects in `properties` this is required, for other objects as in `items` it is optional, should be unique inside the parent object for all its properties to identify this property.
value | [String](#String) | display text to display as value | Required
type | [Identifier-String](#identifier_string) | A type identifier to group different type of objects, examples: UiElement, PageObject, Service, Feature, Story, ... Whatever types make sense to be defined in your application. Scenarioo Viewer can display typed objects in additional search tabs, to see all objects of one or several types in one view to easily search for them. | Optional
id | [Identifier-String](#identifier_string) | A unique identifier for this typed object that is not allowed to contain some special characters. If not set explicitly the libraries will calculate this identifier for you from the object's value by sanitizing unallowed characters. This id will not be displayed but will be used in URLs and internaly for identification and comparison of objects and for storing the objects. It is recommended to keep this field unchanged for object's when they change their value (=display text), to keep trackable how this documented objects evolve between different builds. | Optional
properties | Array of [DocuObject](#DocuObject) | For complex objects having again `DocuObject`s for its attribute values | Optional
items | Array of [DocuObject](#DocuObject) | For objects that contain other objects as items (e.g. same as a usecase that contains scenarios), those objects can contain again `DocuObject`s  as its items. `labelKey` is not required inside this objects contained here. | Optional

Some simple examples of valid `DocuObject`s:

```

        /* Example 1: A simple key value property */
        {            
            labelKey: "simpleStringValue",
            value: "a textual information"
        },

        /* Example 2: More complex description of a typed object (with nested DocuObjects as properties) */
        {
            labelKey: "exception",
            value: "Scenario failed: Element not found",
            type: "Exception",
            id: "ElementNotFoundException",
            properties: [
                {
                    labelKey: "source",
                    value: "expect(element.isPresent()).toBe(true)"
                },
                {
                    labelKey: "exceptionMessage",
                    value: "Failed: No element found using locator: By.cssSelector('div#myUndefinedId')"
                },
                {
                    labelKey: "stackTrace",
                    value: "... put the full stack trace here ..."
                }                
            ]
        }

```
 
For more detailed description and more complex examples, see [`Scenarioo Object Model`](scenarioo_object_model.md).
 
## File System Structure

TODO: Draw a new diagram using draw.io, also commit the draw.io source of the diagram as well as the png image.

Scenarioo documentation data is stored in a certain structure of folders and files. The image below illustrates this. The folder structure reflects the domain model of Scenarioo (see previous chapter).

![Scenarioo File System Structure](https://cloud.githubusercontent.com/assets/5416988/3470838/f6fab378-02bd-11e4-8405-06d4d89c90a3.jpg)

## Files and Folders

### Documentation Root Folder

This is the folder where all the Scenarioo documentation files and folders are stored. Typically it contains a number of branch folders.

### Branches

#### Purpose

Scenarioo allows to document several branches of your applications. You can use this to document co-existing branches and also to document different versions of your software. We reccommend to document each version of your application as a separate branch in Scenarioo.

#### Rules

* A folder in the *documentation root* is a *branch folder* if and only if it also contains a valid `branch.json` file.
* The folder name of a *branch folder* must be the same as the field `ìd` inside the `branch.json`. Libraries will calculate the `id` field and therefore also the name of the directory from the `name` field by replacing special characters.
* It is allowed to have other folders that are not *branch folders* in the *documentation root*. They are ignored by Scenarioo.

#### Fields

A `branch.json` can have following fields to describe a branch:

Name | Type / Format | Description  | Rules
:---|:---|:---
name        | [String](#String)  | Display  for this branch. Use something that identifies your branch or your software version, e.g. "Release 2014-10-25", "Version 3.1", "trunk" or "123-some-super-new-feature". | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this object, if not set explicitly it is calculated from `name` by replacing unallowed characters | Optional
description | [String](#String)  | A short description of the purpose of this branch, what version of your application does this branch contain or document. | Optional
properties  | Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary appplication specific docu data | Optional

#### Example branch.json file

```
{
	"name" : "develop branch",
	"description" : "Here we integrate all the cool features for the next release.",
	"properties" : [
	    {
    		"labelKey" : "authors",
    		"value" : "bruderol, tobiaszuercher, dola, adiherzog, danielsuter, mi-we"
    	}
	]
}
```


### Builds

#### Purpose

You probably want to run a regular build for generating the documentation data. For this purpose, each branch is structured in a number of builds. Each run of all your tests and a belonging fully generated scenarioo documentation of your application is called a *build*.

#### Rules

* A folder in the *branch folder* is a *build folder* if and only if it contains a valid `build.json` file.
* The folder name of a *build folder* must be the URL encoded version of the `name` value in the `build.json`. If this is not the case, the folder is not considered a *build folder*. 
* It is allowed to have other folders that are not *build folders* in a *branch folder*. They are ignored by Scenarioo.

#### Fields

Name | Type | Description
:---|:---|:---
name        | [Identifier-String](#identifier_string) | **Required.** Use something that reflects the uniqueness and order of your builds, e.g. the timestamp or a build sequence number.
date        | [Datetime](#Datetime)    | Start date / time of the build (as a timestamp) --> TODO: Specify exact format
revision    | [String](#String)  | the revision number in your version control system (e.g. changeset number).
status      | [String](#String)  | Whether the build was a `success` or `failed`. If the status is left empty, Scenarioo will calculate it from the states of contained use cases and their scenarios. Scenarioo by default (if not configured otherwise) only supports "failed" and "success" as known status values. All other status values are treated as not successful and displayed in orange.
properties     | Array of [DocuObject](#DocuObject) | Whatever additional information you would like to attach to the build object.


#### Example build.json file

```
{
	"name" : "2014-01-20",
	"revision" : "1290FE2",
	"date" : "2014-01-20T00:00:00+01:00",
	"status" : "success",
	"properties" {
		"build trigger" : "manual",
		"build run duration" : "14 minutes"
	}
}
```


#### Use Case Folder and usecase.json

### Purpose

The documentation is structured into use cases. These use cases should whenever possible reflect the business view. Typical examples are "log in", "send in-app message", "order pizza" or "change profile settings".

### Rules

* A folder in the *build folder* is a *use case folder* if and only if it contains a valid `usecase.json` file.
* The folder name of a *use case folder* must be the URL encoded version of the `name` value in the `usecase.json`. If this is not the case, the folder is not considered a *use case folder*.
* It is allowed to have other folders that are not *use case folders* in a *build folder*. They are ignored by Scenarioo.

#### Fields
  
Name | Type | Description
:---|:---|:---
name        | [Identifier-String](#identifier_string)  | **Required.** Use case name, e.g. "log in" or "change profile settings". Keep this short and use the description field for more information.
description | [String](#String)  | This should give a short description of the use case from a business perspective. All the use case descriptions together should give a good high level overview of the functionality your software offers.
status      | [String](#String)  | Whether the use case was a "success" or "failed". If not set explicitly Scenarioo will calculate it later from all contained scenarios (it will assume "success" if all scenarios inside the use case are a "success")
properties     | Array of [DocuObject](#DocuObject) | Whatever additional information you would like to attach to the usecase object.
labels      | [Labels](#Labels) | Add some info that is interesting on the use case level. E.g. you could label all use cases with "admin" that can only be performed with the admin role.

#### Example usecase.json file

```
{
	"name" : "Find Article",
	"description" : "User wants to find a Wikipedia article page about a certain topic",
	"properties" : {
		"Webtest Class" : "org.wikipedia.webtests.FindFindArticleUITest"
	},
	"labels" : [
		"public"
	]
}
```


#### Scenario Folder and scenario.json

### Purpose

A scenario documents a certain path that is possible to perform a use case. For the "log in" use case this could be "successful log in", "failed because of wrong password", "use forgot password link", etc.

### Rules

* A folder in the *use case folder* is a *scenario folder* if and only if it contains a valid `scenario.json` file.
* The folder name of a *scenario folder* must be the URL encoded version of the `name` value in the `scenario.json`. If this is not the case, the folder is not considered a *scenario folder*.
* It is allowed to have other folders that are not *scenario folders* in a *use case folder*. They are ignored by Scenarioo.

#### Fields

Name | Type | Description
:---|:---|:---
name        | [Identifier-String](#identifier_string)  | **Required.** Scenario name, e.g. "successful log in"
description | [String](#String)  | Here you can add further information about what's special in a scenario and add further documentation about the logic used in the scenario. E.g. "A successful login is only possible if the account is already activated.".
status      | [String](#String)  | Whether the scenario was successful. A scenario usually corresponds to one test case. Therefore this just says whether the test case was green. Scenarioo by default (if not configured otherwise) only supports "failed" and "success" as known status values.
properties     | Array of [DocuObject](#DocuObject) | Whatever additional information you would like to attach to the usecase object.
labels      | [Labels](#Labels)   | Make navigation of scenarios easier, e.g. by labeling scenarios as "happy" (for most important happy path through a use case) or "error" (for error scenarios). Also other cross cutting topics can be put as labels on the scenarios, which makes it easy to find all scenarios concerned with such a specific topic over all use cases.

### Example scenario.json file

```
{
	"name" : "find_multiple_results",
	"description" : "User enters some text and finds multiple pages that contain this text.",
	"status" : "success",
	"properties" : {
		"User Role" : "not authenticated",
		"Requirements" : [{
				"name" : "113 - Search Pages"
			}, {
				"name" : "114 - Search Content"
			}
		]
	},
	"labels" : [
		"happy"
	]
}
```


## Steps of a scenarioo, screenshots and &lt;stepnumber&gt;.json files

### Purpose

A scenario is made up of steps. Each step describes one interaction event in your scenario. Several interactions can happen on the same page (or view) of your user interface.

### Rules

* A *scenario folder* contains the two subfolders `screenshots` and `steps`. If these two folders do not exist, Scenarioo assumes that the scenario does not have any steps but it is still considered a valid scenario.
* For each step, there is a *step file* named `&lt;stepnumber&gt;.json` in the `steps` folder. The step number is a three digit number. The first step has the number `000`. Therefore the first step is described in `000.json`, the second in `001.json` and so on. There are no gaps between the step numbers. A step exists, as soon as there is a valid *step file* for it.
* Each step should also have a *screenshot file* named `&lt;stepnumber&gt;.&lt;fileformat&gt;` and residing in the `screenshots` folder. The rules for numbering are the same as for the *step files*. The absence of a *screenshot file* does not make a *step* invalid. The file format can be any web graphics standard, but PNG is recommended in most cases. It is possible to mix different file formats in one scenario.

### Values

Name | Type | Description
:---|:---|:---
page        | <a href="#page">Page</a>  | Page Information
stepDescription | <a href="#stepDescription">StepDescription</a> | Basic details of the step
html | <a href="#html">Html</a> | HTML source code of the page
metadata | <a href="#step_metadata">StepMetadata</a> | Further details about the step
screenAnnotations | <a href="#screen_annotations">ScreenAnnotation</a> | A screen annotation object

### Fields only used inside a step

#### <a name="page">Page</a>

The page is there to group several interaction steps that occur on the same page (or view). Therefore you should at least provide a unique identifier for this page or view a step occurs on as the `name` for the page. Usually this is that part of the URL (only!) that identifies the page the user is currently on or the name of the view that is currently displayed or interacted with in this step of the test (jsp-Page names, AngularJS routes, etc. are good candidadtes for page names, but you have to decide depending on your application type).

An object with these fields:

Name | Type | Description
:---|:---|:---
name        | [Identifier-String](#identifier_string)  | Name of the page
properties | Array of [DocuObject](#DocuObject) | Metadata of the page
labels | [Labels](#Labels) | Labels for the page

#### <a name="#stepDescription">StepDescription</a>

Contains the most important properties to describe a step.

An object with these fields:

Name | Type | Description
:---|:---|:---
index | <a href="#integer">Integer</a>  | The number of the step (sequential number, starting with 0 for first step)
title | [String](#String) | The title that is currently displayed for the screen in the browser window title bar or as a title on the page (this makes it possible to search for texts inside this titles in scenarioo).
status | [String](#String) | Whether the test step "failed" and was a "success".
screenshotFileName | [String](#String) | The name of the step screenshot file inside the `screenshots` directory (usually something like '000.png', where 000 is the index of the step and '.png' the used image format)
properties | Array of [DocuObject](#DocuObject) | Additional important detail information to describe important properties of a step can be put into this key-value map. This additional information will be displayed in the first section entitled "Step" inside the metadata area on the right side of the step image in the step view. E.g. the current browser URL is a good candidate to store here as a property with name 'URL'. It is recommended to only put the most important properties (that logically belong to the top most metadata section "Step") into this properties object. For more detailed metadata about a step (that you do not want to see in the top metadata section for a step), you should better use `metadata.details` instead, where you can define additional sections for metadata of a step.
labels | [Labels](#Labels) | Labels for the page
	
	
#### <a name="#html">Html</a>

Source code of the page that was displayed in the moment the step was created. Leave it empty if your app is not HTML based (or you can also use it to store other view markup code like XAML here, if you want).

TODO: Describe

#### <a href="#step_metadata">

TODO: Add table

  * `metadata.details` (complex type): Add any interesting additional metadata information in this generic data structure (see [Details](Details) for more information about structure and types of possible content). For each property in this key-value map (which can contain complex objects as values) an own section will be displayed below the "Step" section in the metadata area on the right side of the step image in the step view. E.g. it can be used for adding information about backend calls that have been called in this specific step (to render the current screen) and many other detailed information.
  
#### <a href="#screen_annotations">ScreenAnnotation</a>

TODO: Take spec from https://github.com/scenarioo/scenarioo/issues/149 when the story is finished

### Example step file

-> TODO


# Changes compared to the previous (pre 3.x) file format

* JSON instead of XML file format

* New format for application specific objects, replacing former `details`, now called `properties`: see (scenarioo_object_model.md)

-> TODO
