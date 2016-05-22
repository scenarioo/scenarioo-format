### <a name="Entity">Entity</a>

**Purpose:** just a template to describe an entity in the format.md file

**Location in File Sytem:**
* Directory inside *parent entity directory* with a `entity.json` file inside.
* The directory name of a *entity directory* must be the same as the field `id` inside the `entity.json`.
* All other directories that do not conform to these rules will be ignored by the Scenarioo Viewer.

**Fields of `entity.json`:**

Name | Type / Format | Description  | Rules
:---|:---|:---|:---
name        | [String](#String)  | Display name. Use something that identifies your entity. | Required
id          | [Identifier-String](#identifier_string) | Identifier used for this entity in URLs. | Required (but calculated by libraries from `name`, if not set), must be the same as the directory name.
description | [String](#String)  | A short description text | Optional
labels      | [Labels](#Labels)   | Add some categories that are important to your entity as labels to mark all such entities of special kinds. | Optional
properties  | [Properties](#Properties): Array of [DocuObject](#DocuObject) | For additional properties to add arbitrary appplication specific docu data as important attributes of this entity (displayed in the viewer on an object's details page right below the other direct field values of this object) | Optional
sections | [Sections](#Sections): Array of [DocuObject](#DocuObject) | For even more documentation sections to be added to the documentation of this object. Every section must at least have a `labelKey` as the section title and can be any [DocuObject](#DocuObject) with contained arbitrary appplication specific docu data. Use this for special more detailed aspects of this entity that do not belong logicaly to the direct top level attributes (=properties) of it. | Optional

**Example `entity.json` file:**

```
    TODO
```
