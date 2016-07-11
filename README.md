# Scenarioo Format Specification

This is the specification of the Scenarioo documentation format. To find out more about Scenarioo please visit [www.scenarioo.org](http://www.scenarioo.org).

WARNING: This file format is not used in current versions of Scenarioo 2.x. It is the future format for Scenarioo 3.x. For a reference of the Scenarioo 2.x format, please have a look in our [Wiki](https://github.com/scenarioo/scenarioo/wiki/Scenarioo-Writer-Documentation-Format).

This documentation is targeted to two audiences:

1. Developers of Scenarioo writer libraries that help to write the scenarioo documentation files.

2. Users of those libraries to understand what can be stored where inside the documentation files using the writer libraries in your tests.


## Domain Model Overview

The following diagram gives a rough overview about the major entities in the scenarioo documentation model:

![Scenarioo Domain Model](images/draw.io/scenarioo_domain_model_overview.png)

This major structure of your documenation is also reflected in the Scenarioo Viewer where the major navigation is based on this same structure.

The following explanations should give an overview about the purpose of each of this basic entity types in the model and how they are stored inside json files in the file system.

For more general information about JSON, see [http://json.org](http://json.org)

Please refer to the linked entity descriptions explaining all fields of those entity objects in more details.

Entity Type | Description  | Storage Format
:---|:---|:---
[Branch](#Branch)      | A branch usually reflects a product version that you want to document, e.g. a specific release version, current development version, a special feature branch etc. | A directory in the scenarioo documentation root directory with a `branch.json` file inside, and all other documentation data of that branch as further sub directories.
[Build](#Build)       | A build reflects a full generated documentation version on a specific point in time, this is the major container for all documentation data that you generate during a full build run that tests and documents your software. You would generate such a build for every change, e.g. on every push of changes to that branch. | A directory inside the parent branch directory with a `build.json` file inside, and all other documentation data belonging to that build as further sub directories.
[Use Case](#Use-Case) | A use case documents a user goal a user of your system can perform with your system, that you want to have documented and tested as one group of test/usage scenarios. Usually you will structure your e2e/UI-tests by grouping them into such use cases. E.g. usually you will write one spec file or test class with several test cases or test scenarios to test and document all important scenarios of a use case. Take care to not choose your use cases to fine granular. Those should reflect hi level functions a user can perform with your documented systems. Allways use non-technical user or business language (as much as possible) to name your use cases. | A directory inside the parent build directory with a `usecase.json` file inside, and all other documentation data belonging to that use case (e.g. all usage or test scenarios) as further sub directories.
[Scenario](#Scenario) | A scenario reflects one test case (aka "test scenario") that tests one typical or important flow through the documented use case. Each use case should be typically documented by a few test scenarios. Do not forget to not only test and document the simple happy scenarios, but also important alternative and exceptional scenarios: e.g. at least one alternative scenario for when the user enters invalid data and then corrects it and finally anyway completes the use case, and also important exceptional scenarios for when the user can not complete his goal, because e.g. some other system is not available or important preconditions are not met. | A directory inside the parent build directory with a `scenario.json` file inside, and all other documentation data (e.g. the interaction steps) are stored in further sub directories.
[Step](#Step) | A step reflects one important interaction step or point in time in a test scenario flow. Each step usually consists of a screenshot (if your test is a UI test), further information about the step (e.g. description text, the page object function that triggered that step, input and output data, etc.), and probably also the HTML source code (if it is a web application). | Each description of a step of a scenario is stored as a json file inside the directory `steps` inside the parent scenario directory. The name of the step files are named by the index of the file in format `001.json` (3 digit numbers, or more digits in case you have scenarios with more than thousand steps), the first step index should be `0` and accordingly the first step file is stored as `000.json`.
[Page](#Page) | To improve the navigability in your scenarioo documentation you should try to group all interaction steps in your scenarios by pages. Several steps inside a scenario usually happen on the same page (or view, or dialog or whatsoever), and you can use a page object inside your step description to describe such pages. The `id` field (usually generated by libraries from the `name` field) of such a page identifies it, and inside scenario you can then easily navigate between different scenarios that interact with the same page or view or dialog more easily. | A page and any information about a page is simply stored inside the step description file of a step on the field `page`. Multiple steps can refer to the same page by simply storing an object inside the field `page` with the same `name` and same `id` values inside it (yes, we know that our documentation format is somehow redundant here, but since this data is generated, it causes no real problem here)
[Screenshot](#Screenshot) | Each step can have (optionally) one Screenshot to display the user interface of that step. | Screenshots of steps have to be stored in a separate optional directory `screenshots` inside the parent scenario directory and have to follow the same naming convention as for steps, with the step index as filename: `000.png`, `001.jpeg`, etc.
[HTML Source](#HTML-Source) | You can also store the HTML source for each step to be displayed in the documentation | HTML Sources can be stored in an optional directory `html` inside the scenario directory. HTML source files have the same name as the step index and end with `.html`: `000.html`, `001.html`, etc.
[ScreenAnnotation](#ScreenAnnotation) | Screen annotations are rectangular areas on a step screenshot to highlight them and add additional documentation data to this specific screen areas. This can be used to document where on the screen the test/user interacted (button clicked, data entered, URL changed, etc.) or to highlight special important areas of the screen and to attach arbitrary additional documentation data to this areas (e.g. options the user can choose in a dropdown list, URL a link is pointing to, visual regression test check areas, etc.) | ScreenAnnotations can be optionally stored as objects in an array on the field `screenAnnotations` inside the step description file.

Additionally to these basic model there are some additional important data types for storing more detailed application specific documentation data as part of the above described entities inside their json files.

Following image gives an overview about this additional data types that can be attached to most scenarioo entity objects to store more application specific documentation data:

![Scenarioo Docu Object Model Overview](images/draw.io/scenarioo_docu_object_model_overview.png)

Entity Type | Contained in | Description
:---|:---|:---
[Labels](#Labels) | Use Case, Scenario, Step, Page | Some important scenarioo entity objects have the ability to get labels attached. Labels are an array of special label strings. Each label string is a unique keyword to mark an object with a label. Labels can be searched for in the Scenarioo Viewer and can even be used in URLs or in the UI as filter criteria in some places. Labels can also be configured in the viewer to be displayed in different colors.
[Properties](#Properties) | All Entities: Branch, Build, Use Case, Scenario, Step, Page, DocuObject | Every entity object in the scenario documentation model can have arbitrary additional properties, which are application specific attributes to add to those objects (basically key-value-pairs). Properties are stored as arrays of `DocuObject`. Each property must have a required unique `labelKey` representing the name of that property.
[Sections](#Sections) | Use Case, Scenario, Step | Most important objects in a scenarioo documentation can become more big and more complex and therefore even have the ability to group additional documentation data in so called `sections`. Every section is again a `DocuObject`. The required `labelKey` of each section is the title of the collapsable section inside which this data will be visualized in the documentation.
[Items](#Items) | DocuObject | A generic docu object can even have more related objects as so called `items`. Items is just an array of related `DocuObject`. Each entry can have an optional `labelKey` which represents the label of the relation. Items are important to build `DocuObject` data structures like lists or trees in your documentation data. Like that your own application specific objects can have other related items, just like the scenarioo entities, e.g. like a use case that has scenarios as related items.
[DocuObject](#DocuObject) | Properties, Sections or Items | You can describe arbitrary application specific documentation data as generic DocuObjects. A docu object can be just a simple string `value` to display in the documentation, or it can even have a `type` to group documentation objects of same type and make them more easily navigable in the documentation (e.g. navigate through all tests referring to the same object of a specific `id` and `type`). A `DocuObject` can again have nested `DocuObject` objects inside their `Properties` or `Items` to describe more complex objects and data structures.

##File System Structure

All documentation data, that Scenarioo users should be able to browse in the Viewer, has to be stored in the so called `Scenarioo Documentation Data Root Directory`, that can be configured in the configuration of your Scenarioo Viewer web application deployment.

The following reference example demonstrates an example file structure of such a scenarioo documentation, as described allready in the model overview above.

##Reference Example

You can find a full reference example of such a scenarioo documentation data directory file structure in the directory `reference-example` in this repository:

[Scenarioo Documentation Reference Example](./reference-example)

All libraries are tested to be able to generate exactly this same reference example output, to validate their feature completeness.

Also the Scenarioo Viewer web application is tested against this reference example to validate it can handle all data contained as expected.

## Entities and their fields

The following sections describe for each entity how they are stored and what fields they can have.

### <a name="Branch">Branch</a>

**Purpose:** Document different development branches or product versions of your software system under development.

**Location in File System:**
* Directory in the *documentation root* with a `branch.json` file inside.
* The directory name of a *branch directory* must be the same as the field `id` inside the `branch.json`.
* All other directories that do not conform to these rules will be ignored by the Scenarioo Viewer.

**Fields of `branch.json`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name for this branch. Use something that identifies your branch, e.g. "Release 2014-10-25", "Version 3.1", "trunk" or "123-some-super-new-feature". | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this branch object in URLs | Required (but calculated by Libraries from `name`, if not set), must be the same as the directory name.
description | [String](#String)  | A short description of the purpose of this branch, what version of your application does this branch contain or document. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data | Optional

**Example `branch.json` file:**

```
{
    "id": "develop-branch"
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

### <a name="Build">Build</a>

**Purpose:** Container for all documentation of your software generated during one build run in your automated build system (one point in time, one software revision)

**Location in File System:**
* Directory inside *parent branch directory* with a `build.json` file inside.
* The directory name of a *entity directory* must be the same as the field `id` inside the `build.json`.
* All other directories that do not conform to these rules will be ignored by the Scenarioo Viewer.

**Fields of `build.json`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name of your build (will be displayed together with the build date). Use something short that identifies your build run, e.g `CI Build 128` or `Nightly 42`. | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this entity in URLs. | Required (but calculated by libraries from `name`, if not set), must be the same as the directory name.
description | [String](#String)  | A short description text | Optional
date        | [Datetime](#Datetime)    | Start date & time of the build (as a timestamp) | Optional
revision    | [String](#String)  | the revision number of the tested and documented software in your version control system (e.g. change set number) | Optional
status      | [String](#String) | Whether the build was a `success` or `failed` or any application specific other build status. Scenarioo only recognizes `failed` and `success` as known status values, all other values will be treated as kind of unknown or warning states and are displayed in orange in the Viewer. | Optional (Scenarioo Viewer server will calculate it from status of contained use cases, if the status is not set)
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data | Optional

**Example `build.json` file:**

```
    {
        "id": "CI-Build-142",
        "name" : "CI Build 142",
        "description": "Last commit: Merged with master",
        "revision" : "1.0.4-1290FE2",
        "date" : "2014-01-20T00:00:00+01:00",
        "status" : "success",
        "properties": [
            {
                "labelKey": "trigger",
                "value": "manual"
            },
            {
                "labelKey": "duration",
                "value": "14 min 12 sec"
            }
        ]
    }
```

### <a name="Use-Case">Use Case</a>

**Purpose:** A function of your software that is a typical use case of your software, that you want to document, should reflect a user goal the user can accomplish with your software, should not be to fine granular and reflect the business or even better the user's view.

**Location in File System:**
* Directory inside *parent build directory* with a `usecase.json` file inside.
* The directory name of a *use case directory* must be the same as the field `id` inside the `usecase.json`.
* All other directories that do not conform to these rules will be ignored by the Scenarioo Viewer.

**Fields of `usecase.json`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name. Use something that identifies your use case. Keep this short and use the description for more details. Typical examples are "Order Pizza", "Transfer Money", "Configure Profile", "Task - Create", "Task - Delete" ( as the later examples show, we recommend to group use cases that belong to the same subject, by using the subject as the prefix of the use case name) | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this use case in URLs. In case you often change the names of your use cases, we recommend to set some ids explicitly for your use cases that you won't change over time. | Required (but calculated by libraries from `name`, if not set), must be the same as the directory name.
description | [String](#String)  | This should give a short description of the use case from a business perspective. All the use case descriptions together should give a good high level overview of the functionality your software offers. | Optional
status      | [String](#String)  | Whether the use case was a `success` or `failed` or any application specific other status. Scenarioo only recognizes `failed` and `success` as known status values, all other values will be treated as kind of unknown or warning states and are displayed in orange in the Viewer. | Optional (Scenarioo Viewer server will calculate it from status of contained scenarios, if the status is not set)
labels      | [Labels](#Labels) | Add some categories that are important to your use cases as labels. As an example you could label all use cases with "admin" that can only be performed with the admin role. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data as important attributes of this entity (displayed in the viewer on an object's details page right below the other direct field values of this object) | Optional
sections | [Sections](#Sections): Array of [DocuObject](#DocuObject) | For even more documentation sections to be added to the documentation of this object. Every section must at least have a `labelKey` as the section title and can be any [DocuObject](#DocuObject) with contained arbitrary application specific docu data. Use this for special more detailed aspects of this entity that do not belong logically to the direct top level attributes (=properties) of it. | Optional

**Example `usecase.json` file:**

```
    {
    	"name" : "Find Article",
    	"id": "Find-Article",
    	"description" : "User wants to find an article page about a certain topic or certain content.",
    	"labels" : [
    		"public"
    	],
    	"properties" : [
            {
                "labelKey": "Test-Class",
                "value": "org.wiki.example.webtests.FindArticleWebTest"
            }
        ],
        "sections" : {
    	    "labelKey": "Requirements",
    	    "value": "Could be any value or even long text or data structure, like epics, user stories, etc. that give more information about the requirements of this use case ... you can add arbitrary DocuObject data here ..."
    	}

    }
```

### <a name="Scenario">Scenario</a>

**Purpose:** Documents one user interaction flow through a use case. Every use case should be typically tested and documented by several such scenarios. you should not only test and document the happy paths, but also some alternative scenario paths (e.g. when the user enters some invalid data and then corrects it, because the system tells hom so) or even exceptional scenario paths (like when the user can not continue, because some exception occurs, like some important precondition is violated or the use case can not be completed, because some backend system is not available). For a good test design and also documentation design it is essential to focus on the most important key scenarios for each use case here and not have too much test scenarios for every little detail that will clutter your documentation.

**Location in File System:**
* Directory inside *parent use case directory* with a `scenario.json` file inside.
* The directory name of a *scenario directory* must be the same as the field `id` inside the `scenario.json`.
* All other directories that do not conform to these rules will be ignored by the Scenarioo Viewer.

**Fields of `scenario.json`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name. Use something that identifies your scenario. Keep this short and use the description for more details. Some examples for "Order Pizza" use case scenarios: "new user can order", "existing user can order", "exception when no mozzarella available". <br/><br/>Sometimes it may help to use some special prefixes for the names, such that the alphabetical order of the scenarios inside a use case makes sense from a documentation point of view. | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this entity in URLs.  In case you often change the names of your scenarios, we recommend to set some ids explicitly for your scenarios that you won't change over time between several builds. | Required (but calculated by libraries from `name`, if not set), must be the same as the directory name.
description | [String](#String)  | A short description text to explain what this scenario tests and documents. | Optional
status      | [String](#String)  | Whether the scenario was a `success` or `failed` or any application specific other status. Scenarioo only recognizes `failed` and `success` as known status values, all other values will be treated as kind of unknown or warning states and are displayed in orange in the Viewer. E.g. for test scenarios it makes sometimes sense to use other statuses like e.g. "pending" or "ignored" for tests that are currently marked as ignored or under construction.| Optional (but it is highly recommended to set at least "success" for scenarios that have been successfully executed and "failed" for scenarios that had an error during test execution)
labels      | [Labels](#Labels)   | Add some categories that are important to your scenarios as labels. As an example you could label happy path scenarios as "happy" and exceptional scenarios as "exceptional". Also other cross cutting topics can be put as labels on the scenarios, which makes it easy to find all scenarios concerned with such a specific topic over all use cases. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data as important attributes of this entity (displayed in the viewer on an object's details page right below the other direct field values of this object) | Optional
sections | [Sections](#Sections): Array of [DocuObject](#DocuObject) | For even more documentation sections to be added to the documentation of this object. Every section must at least have a `labelKey` as the section title and can be any [DocuObject](#DocuObject) with contained arbitrary application specific docu data. Use this for special more detailed aspects of this entity that do not belong logically to the direct top level attributes (=properties) of it. | Optional

**Example `scenario.json` file:**

```
   {
        "name" : "Multiple Results",
        "id": "Multiple-Results",
    	"description" : "User searches for text and finds multiple pages that contain this text.",
    	"status" : "success",
    	"labels" : [
            "happy"
        ],
    	"properties" : [
			{
				"labelKey": "User Role",
				"value": "not authenticated",
			},
			{
				"labelKey": "Test",
				"value": "FindArticleWebTest.multipleResults"
			}
    	],
    	"sections": [
    	    {
    	        "labelKey": "Test Code",
    	        "value": "```\n // just an example how you could even fill in your test code to the documentation.\n searchPage.search('text available on multiple pages'); \n searchResultPage.expectMultipleResultsFound(); \n ```"
            }
    	]
    }
```

### <a name="Step">Step</a>

**Purpose:** A step is an important interaction event or state inside a test scenario that is documented. A scenario is made up of several steps that are recorded during the test execution. Several steps can happen on the same page (or view) of your user interface.

**Location in File System:**
* Each step is documented in a json file contained in directory `steps` inside the *parent scenario directory*.
* Step files have the same name as the `index` of the step, but formatted to 3 digits: `000.json`, `001.json` etc.
* If the folder `steps` is missing or does not contain any step files for a scenario, then Scenarioo will still display this scenario, but simply without steps.

**Fields inside a *step json file*:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
index       | [Integer](#Integer) | The index of the step:  Sequential number, starting with 0 for the first step, 1 for second step and so on, no gaps allowed. | Required, unique for each step
name        | [String](#String)  | Short display name for the step. Short explanation about this step (if easily available from your tests) | Optional
id          | [Identifier-String](#Identifier-String) | Identifier used for this step in URLs. Set this if you can set a unique and more stable id for each step, that stays more stable for the same step than the generated id, for the same step over several build runs, even if the scenario is changed. | Optional, Unique for each step inside same scenario (if not available, the server will calculate a unique id for your step from page name, occurrence of that page in your scenario and index of the step inside the same page)
description | [String](#String)  | More longer description text of a step, if you want to add additional textual description for steps. | Optional
title       | [String](#String) | The title that is currently displayed for the screen in the browser window title bar or as a title on the page itself (this makes it possible to search for texts inside this titles in scenarioo). | Optional
visibleText | [String](#String) | Can be used to store all visible text on current screen that is used for full text search inside scenarioo | Optional
page        | [Page](#Page) | Information about the page (or view or dialog or page object ...) on which that interaction step occurred. This is used to group steps that belong logically together also over several scenarios and use cases. | Optional (but recommended)
status      | [String](#String) | Whether the test step `failed` or was a `success` or any application specific other status. Scenarioo only recognizes `failed` and `success` as known status values, all other values will be treated as kind of unknown or warning states and are displayed in orange in the Viewer. | Optional
labels      | [Labels](#Labels)   | Add some categories that are important to your steps as labels to mark steps of special kinds. | Optional
screenAnnotations | Array of [ScreenAnnotation](#ScreenAnnotation) | Several screen annotations to highlight special areas in the screenshot of this step and add visual information to the screenshot as annotations. Can be used to visualize and highlight how the user interacted with the user interface in this step. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data as important attributes of this entity (displayed in the viewer on an object's details page right below the other direct field values of this object). One important property that you might want to add to each step, might for example be the URL in current browser address field. | Optional
sections | [Sections](#Sections): Array of [DocuObject](#DocuObject) | For even more documentation sections to be added to the documentation of this object. Every section must at least have a `labelKey` as the section title and can be any [DocuObject](#DocuObject) with contained arbitrary application specific docu data. Use this for special more detailed aspects of this entity that do not belong logically to the direct top level attributes (=properties) of it. | Optional

**Example *step json file*:**

```
    {
      "index": 0,
      "name": "browsed to search page",
      "title": "My Wiki Search",
      "status": "success",
      "page": {
        "name": "search-page.php",
      },
      "visibleText": "Welcome to my search page of my wiki. Search: ",
      "labels": [ "empty-search" ],
      "properties": [
        {
          "labelKey": "url",
          "value": "http://www.my-example-wiki-search.ch/search-page.php"
        }
      ],
      "sections": [
        {
          "labelKey": "Service Calls",
          "items": [
            {
              "value": "Service 1",
              "type": "Service",
              "properties": [
                {
                  "labelKey": "callDuration",
                  "value": "43 ms"
                }
              ]
            },
            {
              "value": "Service 2",
              "type": "Service",
              "properties": [
                {
                  "labelKey": "callDuration",
                  "value": "259 ms"
                }
              ]
            }
          ]
        }
      ]
    }
```

### <a name="Page">Page</a>

**Purpose:** Describe a page or view or dialog on which an interaction step occurred. This is used to group steps that belong logically together or happen on the same page to navigate between them or even find them in other scenarios or use cases.

**Location in File System:**
* A page is simply stored inside a [Step](#Step) as part of the *step json file* inside field `page`.

**Fields of `page`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name. Use something that identifies your page. This could be a file name of the source code of your page or your view. For web applications it is usually that part of the URL (only!) that identifies the page the user is currently on (without parameters for content data): jsp-Page names, AngularJS routes, etc. are good candidates for page names, but you have to decide depending on your application type. | Required
id          | [Identifier-String](#Identifier-String) | Identifier used for this entity in URLs. | Optional (calculated by server from `name`, if not set).
description | [String](#String)  | A short description text for this page. | Optional
labels      | [Labels](#Labels)   | Add some categories that are important to categorize this page as labels to mark all such pages of special kinds. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data as important attributes of this page (displayed in the viewer on an object's details page right below the other direct field values of this object) | Optional

**Example `page` (as part of a step object):**

```
    "page": {
        "name": "search-page.php",
        "description": "The main search page",
        "labels": ["search-page", "php"]
    }
```

### <a name="Screenshot">Screenshot</a>

**Purpose:** Usually a step has a screenshot of the user interface attached to see, what the user was doing in this step. Screenshots are optional but recommended.

**Location in File System:**
* One Screenshot for each step can be stored in directory `screenshots` inside the *parent scenario directory*.
* The screenshot files has the same name as the `index` of the step the screenshot belongs to, but formatted to 3 digits: `000.png`, `001.jpeg` etc.
* If the folder `screenshots` is missing or a step does not have a screenshot file in this directory, then the step will be displayed without screenshot.

**Supported Image formats:** <br/>
Scenarioo supports all image formats that most web browsers can display, this means:
   * PNG: screenshot files ending with `.png`
   * JPEG: screenshot files ending with `.jpeg`
   * GIF: screenshot files ending with `.gif`
   * SVG: graphics ending with `.svg` (should work with most modern browsers)

### <a name="HTML-Source">HTML Source</a>

**Purpose:** It can be helpful for web applications to also document the underlying HTML source for each user interface step, which is helpful for styling issues or for debugging purpose.

**Location in File System:**
* One HTML source file for each step can be stored in directory `html` inside the *parent scenario directory*.
* The HTML Source file for a step has the same name as the `index` of the step the html belongs to, but formatted to 3 digits: `000.html`, `001.html` etc.
* If the folder `html` is missing or a step does not have a html source file in this directory, then the step will be displayed without the tab for the html sources.

### <a name="ScreenAnnotation">ScreenAnnotation</a>

**Purpose:** A step can have several screen annotations in an array to mark special rectangular regions on the screenshot and add information to this regions, like where the user interacted, with what user interface elements, etc.

**Location in File System:**
* A screen annotation is simply stored inside a [Step](#Step) as part of the *step json file* inside the array in field `screenAnnotations`.

**Fields of `screenAnnotation`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
region  | [ScreenRegion](#ScreenRegion) | Rectangular area (x, y, width, height) on the screenshot that is annotated / highlighted. | Required
style |	[ScreenAnnotationStyle](#ScreenAnnotationStyle) | Enum value that defines what is the meaning of this annotation and how it is styled. Basically each annotation style is styled with a different annotation icon. Can be one of: `DEFAULT`, `HIGHLIGHT`, `INFO`, `WARN`, `ERROR`, `EXPECTED`, `CLICK`,  `KEYBOARD`, `NAVIGATE_TO_URL` | Optional (if not set, the `DEFAULT` is taken as style)
title | [String](#String) | Title for the info popup that can be opened when clicking on a screen annotation | Optional (but recommended)
description | [String](#String) | Description text for the annotation that is displayed inside info popup of the annotation | Optional (but recommended)
screenText | [String](#String) | a text that is displayed inside the rectangular region on the screen | Optional
clickAction | [ScreenAnnotationClickAction](#ScreenAnnotationClickAction) | You can set, that something special should happen, when clicking on a screen annotation. `TO_NEXT_STEP` means to go to the next step when annotation is clicked. `TO_URL` means to open an external url defined in `clickActionUrl` when clicking on the annotation. No value means that the info popup is opened when clicking inside the annotation (as well as when clicking the annotation icon). | Optional
clickActionUrl | [String](#String) | An url to open for clickAction = `TO_URL`, when the annotation is clicked | Optional, but required if clickAction is `TO_URL`
clickActionText | [String](#String) | A text to display as tooltip on the screen annotation, for screen annotations that have a click action, to explain where the annotation is browsing to, when clicked. Same text will also be displayed as a link in the info popup on the annotation, to do the same click action from there. If not set, a meaningful default will be automatically displayed. | Optional (recommended at least for annotations having a click action URL, to describe what this URL points to)
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary application specific docu data as attributes of this screen annotation. Displayed in the viewer inside the popup dialog that can be opened on each screen annotation right below the other direct field values of a screen annotation. | Optional

**Example `screenAnnotations` (as part of a step):**

```
    "screenAnnotations": [
        {
          "style": "CLICK",
          "clickAction": "TO_NEXT_STEP",
          "title": "Clicked 'Submit'",
          "description": "the user clicked the button with text 'Submit'",
          "region": {
            "x": 20,
            "y": 20,
            "width": 200,
            "height": 100
          },
          "properties": [
            {
              "labelKey": "elementLocator",
              "value": "#submit-button"
            }
          ]
        },
        {
          "style": "INFO",
          "clickAction": "TO_URL",
          "clickActionUrl": "http://external-example-application-or-documentation-this-button-jumps-to.ch",
          "clickActionText": "External Docu",
          "screenText": "This is an information pointing to an external docu.",
          "region": {
            "x": 20,
            "y": 220,
            "width": 200,
            "height": 100
          }
        }
    ]
```

### <a name="DocuObject">DocuObject</a>

**Purpose:** A `DocuObject` is an object that describes any additional generic data value or even more complex data objects. It is very powerful and can be used to model arbitrary additional application specific data structures.

**Location in File System:**
* DocuObjects can be attached to every other entity in the scenarioo docu model and are stored as part of all other json files. you can attach DocuObjects on other entities inside the fields `properties` (see [Properties](#Properties)), `sections` (see [Sections](#Sections)) or as related items of other DocuObjects inside `items` (see [Items](#Items)).

**Fields of `DocuObject`:**

Name | Type / Format | Description | Rules
:---|:---|:---|:---
labelKey | [String](#String) | Kind of the identifier (key) and the label text for the property or the relation to an item. Can be used for configuration purpose, e.g. to select some special property values to display in some special views e.g. as table columns. And this field is special since it does not really belong to the information value object, meaning, that same object value, even typed value, can occur with multiple different label keys of course. | For objects in [Properties](#Properties) and in [Sections](#Sections) this is required, for other objects as in [Items](#Items) it is optional. The `labelKey` must be unique inside the objects parent Properties- or Sections-collection, furthermore the key should be even unique inside the parent object for all its children objects to identify the relation to that object (the property or section, or optionally even the item).
value | [String](#String) | display text to display as value | Optional, recommended for most objects that have a well defined value or display text, except for collection objects like a list of sub items that do not have a value and identity on their own.
type | [Identifier-String](#Identifier-String) | A type identifier to group different type of objects, examples: UiElement, PageObject, Service, Feature, Story, ... Whatever types make sense to be defined in your application. Scenarioo Viewer can display typed objects in additional search tabs, to see all objects of one or several types in one view to easily search for them. | Optional
id | [Identifier-String](#Identifier-String) | A unique identifier for this typed object that is not allowed to contain some special characters. If not set explicitly the libraries will calculate this identifier for you from the object's value by sanitizing illegal characters. This id will not be displayed but will be used in URLs and internally for identification and comparison of objects and for storing the objects. It is recommended to keep this field unchanged for object's when they change their value (=display text), to keep traceable how this documented objects evolve between different builds. | Optional. Objects that have a type will get an id automatically assigned from the server, that is calculated from `name`, in case `id` is not set explicitly.
properties | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For complex objects having again `DocuObject`s for its attribute values | Optional
items | [Items](#Items): Array of [DocuObject](#DocuObject) | For objects that contain other objects as items (e.g. same as a use case that contains scenarios), those objects can contain again `DocuObject`s  as its items. `labelKey` is not required inside this objects contained here. | Optional

**Example `DocuObject` objects (as properties of a step):**
```

    "properties": [

        /* Example 1: A simple key value property */
        {
            "labelKey": "simpleStringValue",
            "value": "a textual information"
        },

        /* Example 2: More complex description of a typed object (with nested DocuObjects as properties) */
        {
            "labelKey": "exception",
            "value": "Scenario failed: Element not found",
            "type": "Exception",
            "id": "ElementNotFoundException",
            "properties": [
                {
                    "labelKey": "source",
                    "value": "expect(element.isPresent()).toBe(true)"
                },
                {
                    "labelKey": "exceptionMessage",
                    "value": "Failed: No element found using locator: By.cssSelector('div#myUndefinedId')"
                },
                {
                    "labelKey": "stackTrace",
                    "value": "... put the full stack trace here ..."
                }
            ]
        }
    ]
```

For more detailed description and more complex examples, see [`Scenarioo Object Model`](scenarioo_object_model.md).


## Data Types

### <a name="Integer">Integer</a>

A usual integer number.

### <a name="String">String</a>

A regular string as defined by the JSON format, all characters in UTF-8 are allowed.

### <a name="Identifier-String">Identifier-Sring</a>

All fields that are used as identifiers and therefore can be part of a URL have this type, and in this kind of string only usual characters are allowed, no spaces, no slashes and not other special characters, except for `-` and `_`.

**Regexp:** `[A-Za-z_0-9\-]+`

Libraries have to provide a `IdentifierFormat.sanitize`-Function, that can transform a usual String into such an Identifier-String.

Libraries as well as the server will generate missing `id` fields on objects by calculating them automatically from the `name`-fields using this `sanitize`-Function.

The `sanitize` function will replace illegal characters as following:

 * Replace all diacritics (e.g. ä, ö, ü, é) by according normal characters (a, o, u, e)
 * Replace slashes (`\` and `/`) by `_`
 * Replace any other illegal characters (spaces etc.) by `-`

### <a name="Datetime">Datetime</a>

The `Datetime` format used in scenarioo is a usual ISO data time format, as specified here: https://en.wikipedia.org/wiki/ISO_8601

### <a name="Labels">Labels</a>

The value of a labels field is an array of labels, each label is a string that has to conform to following regexp.

Regexp: `[ A-Za-z_0-9\-]+`

### <a name="Properties">Properties</a>

The value of a properties field is an array of [DocuObject](#DocuObject). Each contained DocuObject must at least have a required `labelKey` which has to be unique inside the array. No more special rules apply. The array may also be empty or missing.

### <a name="Sections">Sections</a>

The value of a `sections` field is an array of [DocuObject](#DocuObject). Each contained DocuObject must at least have a required `labelKey` which has to be unique inside the array. No more special rules apply. The array may also be empty or missing.

### <a name="Items">Items</a>

The value of an `items` field is a simple array of [DocuObject](#DocuObject). No special rules apply to the contained docu objects. The array may also be empty or missing.

### <a name="ScreenRegion">ScreenRegion</a>

A screen region is a rectangular area on a screenshot. It is an object having following fields:

Name | Type / Format | Description | Rules
:---|:---|:---|:---
x  | [Integer](#Integer) | x coordinate in pixels on the screenshot | Required
y  | [Integer](#Integer) | y coordinate in pixels on the screenshot | Required
width | [Integer](#Integer) | width in pixels of the rectangular area | Required
height | [Integer](#Integer) | height in pixels of the rectangular area | Required

### <a name="ScreenAnnotationStyle">ScreenAnnotationStyle</a>

Enum of possible string values for [ScreenAnnotation](#ScreenAnnotation)'s `style` field. Following values are supported:

Value | Description
:---|:---
`DEFAULT` | A simple annotation with no special style (no icon), same style is used if style field is not set.
`INFO` | For information annotations, with an information icon.
`WARN` | For warning annotations, with a warning icon.
`ERROR` | For error annotations, with an error icon.
`HIGHLIGHT` | For annotations that highlight a special area of interest in a screenshot.
`EXPECTED` | For annotations that mark an area where something was successfully validated, with a check mark as icon (e.g. for input fields where the test expected some values to be contained)
`CLICK` | For click annotations, e.g. for UI elements that have been clicked in the test.
`KEYBOARD`| For annotations to mark input fields where the user entered some data or to inform about keyboard events.
`NAVIGATE_TO_URL` | To inform that the user entered or browsed to some special URL to get to this page.

### <a name="ScreenAnnotationClickAction">ScreenAnnotationClickAction</a>

Enum of possible string values for [ScreenAnnotation](#ScreenAnnotation)'s `clickAction` field. Following values are supported:

Value | Description
:---|:---
(null) | No clickAction value means, that no special click action will happen when clicking on the rectangular area of a ScreenAnnotation in the Scenarioo Viewer. In that case the default behaviour will be used, which is to open a popup dialog that shows all the attached information of a screen annotation and that can always be opened, when clicking on the icon on the screen annotation (also when one of the other values is set).
`TO_URL` | when the user clicks on the Screen Annotation in the Scenarioo Viewer the url in `clickActionUrl` will be opened in a new browser tab.
`TO_NEXT_STEP` | when the user clicks on the screen annotation, he will browse to the next step in the same scenario. Useful to annotate click elements that caused the test scenario to proceed to a new step.

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
     This is not explicitly modeled as a separate class anymore, just add your reference as if it was a normal object without any data (on fields `properties` or `ìtems`) provided:
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