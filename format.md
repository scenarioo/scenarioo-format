# Scenarioo Format Specification

This is the specification of the Scenarioo documentation format. To find out more about Scenarioo please visit [www.scenarioo.org](http://www.scenarioo.org).

WARNING: This file format is not used in current versions of Scenarioo 2.x. It is the future format for Scenarioo 3.x. For a reference of the Scenarioo 2.x format, please have a look in our [Wiki](https://github.com/scenarioo/scenarioo/wiki/Scenarioo-Writer-Documentation-Format).

This doucmentation is mainly targeted to developers of libraries which can write the scenarioo documentation format. As a user of scenarioo you would probably use one of those libraries that will help you write this format out of your tests.
Neverteless it can also be very helpful for users of those libraries to understand the format in details, what can be stored where in scenarioo. Therefore we also recommend this documentation format description to be read for users of the scenarioo libraries.

## Domain Model Overview

The following diagram gives a rough overview about the major entities in the scenarioo documentation model:

![Scenarioo Domain Model](images/draw.io/scenarioo_domain_model_overview.png)

This major structure of your documenation is also reflected in the Scenarioo Viewer where the major navigation is based on this same structure.

The following explanations should give an overview about the purpose of each of this basic entity types in the model and how they are stored inside json files in the file system.

For more general information about JSON, see [http://json.org](http://json.org)

Please refer to the linked more detailed entity descriptions explaining all data that you can store inside each of this entity objects.

Entity Type | Description  | Storage Format
:---|:---|:---
[Branch](#Branch)      | A branch usually reflects a product version that you want to document, e.g. a specific release version, current development version, a special feature branch etc. | A directory in the scenarioo documentation root directory with a `branch.json` file inside, and all other documentation data of that branch as further sub directories.
[Build](#Build)       | A build reflects a full generated documentation version on a specific point in time, this is the major container for all documentation data that you generate during a full build run that tests and documents your software. You would generate such a build for every change, e.g. on every push of changes to that branch. | A directory inside the parent branch directory with a `build.json` file inside, and all other documentation data belonging to that build as further sub directories.
[Use Case](#Use Case) | A use case documents a user goal a user of your system can perform with your system, that you want to have documented and tested as one group of test/usage scenarios. Usually you will structure your e2e/UI-tests by grouping them into such use cases. E.g. usually you will write one spec file or test class with several test cases or test scenarios to test and document all important scenarios of a use case. Take care to not choose your use cases to fine granular. Those should reflect hi level functions a user can perform with your documented systems. Allways use non-technical user or business language (as much as possible) to name your use cases. | A directory inside the parent build directory with a `usecase.json` file inside, and all other documentation data belonging to that use case (e.g. all usage or test scenarios) as further sub directories.
[Scenario](#Scenario) | A scenario reflects one test case (aka "test scenario") that tests one typical or important flow through the documented use case. Each use case should be typically documented by a few test scenarios. Do not forget to not only test and document the simple happy scenarios, but also important alternative and exceptional scenarios: e.g. at least one alternative scenario for when the user enters invalid data and then corrects it and finally anyway completes the use case, and also important exceptional scenarios for when the user can not complete his goal, because e.g. some other system is not available or important preconditions are not met. | A directory inside the parent build directory with a `scenario.json` file inside, and all other documentation data (e.g. the interaction steps) are stored in further sub directories.
[Step](#Step) | A step reflects one important interaction step or point in time in a test scenario flow. Each step usually consists of a screenshot (if your test is a UI test), further information about the step (e.g. description text, the page object function that triggered that step, input and output data, etc.), and probably also the HTML source code (if it is a web application). | Each description of a step of a scenario is stored as a json file inside the directory `steps` inside the parent scenario directory. The name of the step files are named by the index of the file in format `001.json` (3 digit numbers, or more digits in case you have scenarios with more than tousand steps), the first step index should be `0` and accordingly the first step file is stored as `000.json`. Screenshots of steps have to be stored in a separate optional directory `screenshots` inside the parent scenario directory. And also the html sources are stored in an optional directory `html` inside the scenario directory. All these files have to follow the same naming conventions to have the same name containing the step index they belong to: `000.png` or `000.jpeg` and `000.html`.
[Page](#Page) | To improve the navigability in your scenarioo documentation you should try to group all interaction steps in your scenarios by pages. Several steps inside a scenario usually happen on the same page (or view, or dialog or whatsoever), and you can use a page object inside your step description to describe such pages. The `id` field (usually generated by libraries from the `name` field) of such a page identifies it, and inside scenario you can then easily navigate between different scenarios that interact with the same page or view or dialog more easily. | A page and any information about a page is simply stored inside the step description file of a step on the field `page`. Multiple steps can refer to the same page by simply storing an object inside the field `page` with the same `name` and same `id` values inside it (yes, we know that our documentation format is somehow redundant here, but since this data is generated, it causes no real problem here)

Additionaly to these basic model there are some additional important data types for storing more detailed application specific documentation data as part of the above described entities inside their json files.

Following image gives an overview about this additional data types that can be attached to most scenarioo entity objects to store more application specific documentation data:

![Scenarioo Docu Object Model Overview](images/draw.io/scenarioo_docu_object_model_overview.png)

Entity Type | Contained in | Description
:---|:---|:---
<a name="Properties">Properties</a> | All Entities: Branch, Build, Use Case, Scenario, Step, Page, DocuObject | Every entity object in the scenario documentation model can have arbitrary additional properties, which are application specific attributes to add to those objects (basically key-value-pairs). Properties are stored as arrays of `DocuObject`. Each property must have a required unique `labelKey` representing the name of that property.
<a name="Sections">Sections</a> | Use Case, Scenario, Step | Most important objects in a scenarioo documentation can become more complex and therefore have the ability to add additional documentation data in so called `sections`. Every section is again a `DocuObject`. The required `labelKey` of each section is the title of the collapsable section inside which this data will be visualized in the documentation.
<a name="Items">Items</a> | DocuObject | A generic docu object can even have more related objects as so called `items`. Items is just an array of related `DocuObject`. Each entry can have an optional `labelKey` which represents the label of the relation. Items are important to build `DocuObject` data structures like lists or trees in your documentation data. Like that your own application specific objects can have other related items, just like the scenarioo entities, e.g. like a use case that has scenarios as related items.
[DocuObject](#DocuObject) | Properties, Sections or Items | You can describe arbitrary application specific documentation data as generic DocuObjects. A docu object can be just a simple string `value` to display in the documentation, or it can even have a `type` to group documenation objects of same type and make them more easily navigatable in the documentation (e.g. navigate through all tests refering to the same object of a specific `id` and `type`). A `DocuObject` can again have nested `Properties` or `Items` to describe more complex objects and data structures.
[Labels](#Labels) | Use Case, Scenario, Step, Page | Some important scenarioo entity objects have the ability to get labels attached. Labels are an array of special label strings. Each label string is a unique keyword to mark an object with a label. Labels can be searched for in the Scenarioo Viewer and can even be used in URLs or in the UI as filter criterias in some places.

##File System Structure

All documentation data, that Scenarioo users should be able to browse in the Viewer, has to be stored in the so called `Scenarioo Documentation Data Root Directory`, that can be configured in the configuration of your Scenarioo Viewer web application deployment.

The following reference example demonstrates an example file structure of such a scenarioo documentation, as described allready in the model overview above.

##Reference Example

You can find a full reference example of such a scenarioo documentation data directory file structure in the directory `reference-example` in this repository:

[Scenarioo Documentation Referecne Example](./reference-example)

All libraries should be tested to be able to generate exactly this same example, to validate their feature completeness.

## Entities and their fields

### Branch

#### Purpose

Scenarioo allows to document several branches of your applications. You can use this to document co-existing branches and also to document different versions of your software. We reccommend to document each version of your application as a separate branch in Scenarioo.

#### Rules

* A folder in the *documentation root* is a *branch folder* if and only if it also contains a valid `branch.json` file.
* The folder name of a *branch folder* must be the same as the field `ìd` inside the `branch.json`. Libraries will calculate the `id` field and therefore also the name of the directory from the `name` field by replacing special characters.
* It is allowed to have other folders that are not *branch folders* in the *documentation root*. They are ignored by Scenarioo.

#### Fields

A `branch.json` can have following fields to describe a branch:

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
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




## Data Types

### <a name="String">String</a>

A regular string as defined by the JSON format, all characters in UTF-8 are allowed.

### <a name="identifier_string">Identifier-Sring</a>

All fields that are used as identifiers and therefore can be part of a URL have this type, and in this kind of string only usual characters are allowed, no spaces, no slashes and not other special characters, except for `-` and `_`.

Regexp: `[A-Za-z_0-9\-]+`

### <a name="Datetime">Datetime</a>

The `Datetime` format used in scenarioo is a usual ISO data time format, as specified here: https://en.wikipedia.org/wiki/ISO_8601

### <a name="Labels">Labels</a>

The value of a labels field is an array of labels, each label is a string that has to conform to following regexp.

Regexp: `[ A-Za-z_0-9\-]+`

### <a name="DocuObject">DocuObject</a>

A `DocuObject` is an object that describes any additional generic data value or even more complex data objects.

`DocuObject`s are very powerful and can be used to model arbitrary application specific data structures.

Each `DocuObject` consists of following fields:

Name | Type / Format | Description | Rules
:---|:---|:---|:---
labelKey | [String](#String) | Kind of the identifier (key) and the label text for the property or the relation to an item. Can be used for configuration purpose, e.g. to select some special property values to display in some special views e.g. as table columns. And this field is special since it does not realy belong to the information value object, meaning, that same object value, even typed value, can occur with multiple different label keys of course. | For objects in `properties` this is required, for other objects as in `items` it is optional, should be unique inside the parent object for all its properties to identify this property.
value | [String](#String) | display text to display as value | Optional, recommended for most objects that have a well defined value or display text, except for structural objects like a list of subitems that does not have a value on its own.
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

# Migration to Format 3.x

When you want to use the new power of the new Format 3.0 you have to slightly change the way you fill in your Scenarioo documentation data into this new format.

Most fields are kept the same as in the old format and the basic hi-level structure is still the same.

Following things are different:

* JSON instead of XML file format: just update your writer library, it will take care of writing json files in the correct structure for you!

* All `Details` and `details` fields on all objects are replaced by the new generic object model as described [here](scenarioo_object_model.md). Instead of adding data to details with `addDetail` you have to use `properties.add` or `ìtems.add` instead and slightly adopt the data you fill in to the new `DocuObject`data model structure. this means the following:

   * Add string values:
      ```
      // before:
      scenarioObject.addDetail("key", "value");

      // after:
      scenarioObject.addProperty("key", "value");
      ```

   * Add object values (former usage of removed class `ObjectDescription`):
     ```
     // before:
     ObjectDescription myObject = new ObjectDescription("MyObjectType", "my object name");
     scenarioObject.addDetail("key", myObject);

     // after:
     DocuObject myObject = scenarioObject.addProperty("key", "my object name");
     myObject.setType("MyObjectType");

     // or even shorter (if you like new fluent notation):
     scenarioObject.addProperty("key", "my object name").type("MyObjectType");
     ```

   * Add Object references (former usage of class `ObjectReference`):
     This is not explicitly modeled as a seprate class anymore, just add your reference as if it was a normal object without any data (on fields `properties` or ìtems`) provided:
     ```
     // before:
     ObjectReference myObjectRef = new ObjectReference("MyObjectType", "my object name");
     scenarioObject.addDetail("key", myObjectRef);

     // after (using new fluent notation):
     DocuObject myObject = scenarioObject.addProperty("key", "my object name").type("MyObjectType");
     ```

   * Add a list of data items (former class `ObjectList`):
      ```
      // before:
      ObjectList myObjectList = new ObjectList();
      myObjectList.add("item 1";
      myObjectList.add("item 2");
      scenarioObject.addDetail("key", myObjectList);

      // after:
      DocuObject myObjectList = scenarioObject.addProperty("key");
      myObjectList.addItem("item 1"):
      myObjectList.addItem("item 2"):
      ```
   * Add tree structures (former class `ObjectTree`):
     TODO


... TODO ...