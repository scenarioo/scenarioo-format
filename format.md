# Scenarioo file format and folder structure

This is the specification of the Scenarioo documentation format. To find out more about Scenarioo please visit [www.scenarioo.org](http://www.scenarioo.org).

WARNING: This file format is not used in current versions of Scenarioo 2.x. It is the future format for Scenarioo 3.x. For a reference of the Scenarioo 2.x format, please have a look in our [Wiki](https://github.com/scenarioo/scenarioo/wiki/Scenarioo-Writer-Documentation-Format).

# General rules

**Important note:** Whenever we talk about URL encoding here, we use the `+` sign to encode a space character instead of `%20`.

# Domain model

![Scenarioo Domain Model](images/draw.io/Scenarioo Domain Model.png)


[![](a.png)](images/draw.io/Scenarioo Domain Model.png)

# File System Structure

TODO: Draw a new diagram using draw.io, also commit the draw.io source of the diagram as well as the png image.

Scenarioo documentation data is stored in a certain structure of folders and files. The image below illustrates this. The folder structure reflects the domain model (see [Core Concepts](Core-Concepts)) of Scenarioo.

[![](Scenarioo File System Structure)](https://cloud.githubusercontent.com/assets/5416988/3470838/f6fab378-02bd-11e4-8405-06d4d89c90a3.jpg)

# Folders

## Documentation Root Folder

This is the folder where all the Scenarioo documentation files and folders are stored. Typically it contains a number of branch folders.


## Branch Folder and branch.json

# Purpose

Scenarioo allows to document several branches of your applications. You can use this to document co-existing branches and also to document different versions of your software. In most projects where we use Scenarioo so far, we document each version of our software as a separate branch. Usually this corresponds to a branch in our version control system.

# Rules

* A folder in the documentation root is a branch folder if and only if it also contains a branch.json file. All other folders are not considered branch folders. It is allowed to have other folders that are not branch folders in the documentation root.


* The folder name is the URL encoded version of the `name` value in the `branch.json` 
* Mandatory fields:
  * `name`: Use something that identifies your branch or your software version, e.g. "Release 2014-10-25", "Version 3.1", "trunk" or "123-some-super-new-feature".
* Recommended fields:
  * `description`:  a short description of the purpose of this branch, what version of your application does this branch contain or document.

Often the branch.json needs not to be generated automatically through the writer library. This can either be created manually for each new branch or through a simple script, because this part should not be different for each generated build.

## Build Folder and build.json

You probably want to run a regular build for generating the documentation data. For this purpose, each branch is structured in a number of builds. Each run of all your tests and a belonging fully generated scenarioo documentation of your application is called a "build".

* A branch folder has a sub folder for each build
* In each build folder, there needs to be a `build.json` file (complex type `build` in XML schema)
* The folder name is the URL encoded version of the `name` value in the `build.json` file
* Mandatory fields:
  * `name`: Use something that reflects the uniqueness and order of your builds, e.g. the timestamp or a build sequence number.
  * `date`: Start date / time of the build (as a timestamp)
* Important optional fields:
  * `revision`: the revision number in your version control system (e.g. changeset number).
  * `status`: Whether the build was a `success` or `failed`. If the status is left empty, scenarioo will calculate it from the states of contained use cases and their scenarios. Scenarioo by default (if not configured otherwise) only supports "failed" and "success" as known status values. All other status values are treated as not successful and displayed in orange by default.

The build.json file often is generated from your build scripts and does not necessarily have to be written through the writer library.

### Use Case Folder and usecase.json

The documentation is structured into use cases. These use cases should whenever possible reflect the business view. Typical examples are "log in", "send in-app message", "order pizza" or "change profile settings".

* A build folder has a sub folder for each use case
* In each use case folder, there needs to be a `usecase.json` file (complex type `useCase` in XML schema)
* The folder name is the URL encoded version of the `name` value in the `usecase.json` file
* Mandatory fields:
  * `name`: Use case name, e.g. "log in" or "change profile settings". Keep this short and use the description field for more information.
* Recommended fields:
  * `status`: Whether the use case was "success" or "failed". If not set explicitly scenarioo will calculate it later from all contained scenarios (it will assume "success" if all scenarios were a "success")
  * `description`: This should give a short description of the use case from a business perspective. All the use case descriptions together should give a good high level overview of the functionality your software offers.
  * `labels`: Add some info that is interesting on the use case level. E.g. you could label all use cases with "admin" that can only be performed with the admin role.

### Scenario Folder and scenario.json

A scenario documents a certain path that is possible to perform a use case. For the "log in" use case this could be "successful log in", "failed because of wrong password", "use forgot password link", etc.

* A use case folder has a sub folder for each scenario
* In each scenario folder there needs to be a `scenario.json` file (complex type `scenario` in XML schema)
* The folder name is the URL encoded version of the `name` value in the `scenario.json` file
* Mandatory fields:
  * `name`: Scenario name, e.g. "successful log in"
  * `status`: Whether the scenario was successful. A scenario usually corresponds to one test case. Therefore this just says whether the test case was green. Scenarioo by default (if not configured otherwise) only supports "failed" and "success" as known status values.
* Recommended fields:
  * `description`: Here you can add further information about what's special in a scenario and add further documentation about the logic used in the scenario. E.g. "A successful login is only possible if the account is already activated.".
  * `labels`: Make navigation of scenarios easier, e.g. by labeling scenarios as "happy" (for most important happy path through a use case) or "error" (for error scenarios). Also other cross cutting topics can be put as labels on the scenarios, which makes it easy to find all scenarios concerned with such a specific topic over all use cases.

### Steps

A scenario is made up of steps. Each step describes one interaction event in your scenario. Several interactions can happen on the same page (or view) of your user interface.

* A scenario folder (named after the scenario) contains a subfolder `steps` and a sufolder `screenshots`
* For each step, there is an XML file in the steps folder (complex type `step` in XML schema), this step files are just numbered like 000.json, 001.json, etc.
* Each step references an image file inside the 'screenshots' directory through the mandatory field `stepDescription.screenshotFileName`. This screenshots can be of any web image format: we recommend PNG, but could also be JPEG, whichever better fits your application or the current step, depending on the content of the current screen. Usually PNG is the best fit, unless a screen is graphically very complex and contains a lot of bitmap images like fotos.
* Mandatory fields: 
  * `stepDescription` (complexType): contains the most important properties to describe a step (also displayed on the scenarioo overview for each step of the scenarioo):
    * `index`: the number of the step (sequential number, starting with 0 for first step)
    * `screenshotFileName`: the name of the step screenshot file inside the `screenshots` directory (usually something like '000.png', where 000 is the index of the step and '.png' the used image format)
* Recommended fields:
  * `page` (complex type): The page is there to group several interaction steps that occur on the same page (or view). Therefore you should at least provide a unique identifier for this page or view a step occurs on as the `name` for the page. Usually this is that part of the URL (only!) that identifies the page the user is currently on or the name of the view that is currently displayed or interacted with in this step of the test (jsp-Page names, AngularJS routes, etc. are good candidadtes for page names, but you have to decide depending on your application type).
  * `stepDescription.title`: The title that is currently displayed for the screen in the browser window title bar or as a title on the page (this makes it possible to search for texts inside this titles in scenarioo).
  * `stepDescription.details` (complex type): additional important detail information to describe important properties of a step can be put into this key-value map (see [Details](Details) for more information about structure and types of possible content). This additional information will be displayed in the first section entitled "Step" inside the metadata area on the right side of the step image in the step view. E.g. the current browser URL is a good candidate to store here as a property with name 'URL'. It is recommended to only put the most important properties (that logically belong to the top most metadata section "Step") into this details object. For more detailed metadata about a step (that you do not want to see in the top metadata section for a step), you should better use `metadata.details` instead, where you can define additional sections for metadata of a step.
  * `metadata.details` (complex type): Add any interesting additional metadata information in this generic data structure (see [Details](Details) for more information about structure and types of possible content). For each property in this key-value map (which can contain complex objects as values) an own section will be displayed below the "Step" section in the metadata area on the right side of the step image in the step view. E.g. it can be used for adding information about backend calls that have been called in this specific step (to render the current screen) and many other detailed information.
  * `html` (complex type): Source code of the page that was displayed in the moment the step was created. Leave it empty if your app is not HTML based (or you can also use it to store other view markup code like XAML here, if you want).

Your writer library should not decide in any way for the users of the libraries when (on what events) and how (what content) a step is stored. We recommend to leave this integration with the tests open to the user of a writer. This means that the user of the library has to write some hooks on his own to capture the ineraction events of the tests and generating the step content. This may sound like a lot of extra work for the test writer. But in reality, it is very easy to write such hooks (even generically for all tests, e.g. by using some listener mechanisms of test toolkits). The advantage of this strategy, to leave this integration into the tests to the test writer, is, that the test writer has a lot of freedom about when and how to generate step content and what information to store in what way into the steps. This advantage outweighs by far the disadvantage of having to write this little amount of code for integrating it into the tests. This gives a lot more power to the test writers on how exactly to create documentation content and what information to store into the documentation. Also it helps to focus in the writer library on "doing one small responsibility right" (namely writing the documentation format correctly) and to not make the writer library depend on application or test toolkit specific stuff.

## Common Concepts

Here are some detail descriptions about important common concepts that are used in various parts of the scenarioo file format and therefore need to be supported by a writer:
* [Safe Identifiers](Safe Identifiers)
* [Labels](Labels)
* [Details](Details)
