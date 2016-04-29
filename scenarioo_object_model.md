# New Scenarioo Object Model

> replaces former generic Details data model
> This is work in progress ... this is only a first draft to discuss further ...

The Scenarioo Object Model allows to add arbitrary application-specific documentation data to any object in the scenarioo model.

Each object in the scenario model has a property `properties` (similar to `details` in scenarioo 2.x model) that can be used to attach additional data attributes to an object.
This `properties` basically is an array of entries (with `labelKey`, `value` and optionaly some more meta data information) explained in more details in following sections.

Inside such properties you can even store more complex objects of complex data structure, that have a `type` and  which can again contain `properties`. 
Similar to all scenarioo's explicit object types (useCase, scenario, step, page, ...) also your own application-specific type of objects can contain again sub items in an optional field called `ìtems`.
Using `ìtems` you can model objects who contain again a list of sub objects, the same as e.g. a useCase in the scenarioo domain model, that has scenarios as sub items.

## Model Overview

A picture says more than tousand words:

![Scenarioo Object Model Example](images/draw.io/scenarioo_object_model.png)
 
This example UML Object Diagram demonstrates how all elements of an UML object diagram could be modeled in the new Scenarioo Model: 
See annotations in color with mapping the elements to the new scenarioo model.

This means that any UML object model could be kind of stored using the Scenarioo Object Model.

### Analogy to Tables

Another possible analogy for our model (if you do not like UML models) could be a table where cells of data is stored.
Each entry inside `properties` is a cell in the table row for its object. And each item inside `items` is again a table row for hierarchical sub items.

Each cell entry can be described as follows:

 * `labelKey`: key & caption of the column
 * `value`: value of the cell (in display format)
 * `type`: type of the cell (for complex object values that represent a special type of object)
 * `id`: special unique identifier for typed objects stored in a cell (can be used for references to this same complex value and will be used in URLs to it)
 * `properties`: attributes of more complex data items stored in a cell
 * `items`: for complex data items having hierarchical sub items 
 
### Properties versus Items
 
If the distinction between `properties`  and `items` is not understandable for you:

 * `properties` are simple attributes describing a data object
 * `ìtems` are hierarchical sub items (e.g. like a usecase has several scenarios and a scenario has several steps)
 * It is similar to attributes/fields (=`properties`) versus references/associations (=`items`) in the UML model
 * Both have same power concerning what data can be modeled/stored inside, but the visualization (where you see what) will be different

## Model Documenation

Each entry in a `properties` or `items` array is a JSON object that can have following fields (=json properties):

Name | Type | Description
:---|:---|:---
labelKey | String  | (Required. for properties, for items optional, must be unique inside the parent object for all its properties to identify this property) Kind of the identifier (key) and the label text for the property or the relation to an item. Can be used for configuration purpose, e.g. to select some special property values to display in some special views e.g. as table columns. And this field is special since it does not realy belong to the information value object, meaning, that same object value, even typed value, can occur with multiple different label keys of course.
value | String | display text to display as value, optional but recommended for most properties. For objects with a `type` at least one of `value` and `id` must be provided and should be a unique identifier for all objects of same type.
type | Identifier-String | (optional) a type identifier to group different type of objects, examples: UiElement, PageObject, Service, Feature, Story, ... Whatever types make sense to be defined in your application. Scenarioo Viewer can display typed objects in additional search tabs, to see all objects of one or several types in one view to easily search for them."
id | Identifier-String | (only for object's having a type field or as well for other typed concrete scenarioo objects, optional) A unique identifier for this typed object that is not allowed to contain some special characters (/, \). If not set explicitly the libraries will calculate this identifier for you from the object's value by sanitizing unallowed characters. This id will not be displayed but will be used in URLs and internaly for identification and comparison of objects and for storing the objects. It is recommended to keep this field unchanged for object's when they change their value (=display text), to keep trackable how this documented objects evolve between different builds.
properties | array | (optional) can contain again properties of same kind for more complex structured data objects
items | array | (optional) for objects that contain other objects as items (e.g. same as usecase contains scenarios). can contain same type of objects as properties can have, but `labelKey` is not required here.  

## Example

**Specification by Example:**

The following example demonstrates how this model can be used to add concrete different kind of application-specific data to a scenario in your scenarioo documentation.
(same is of course also possible on a branch, build, useCase, step, and page)
 
See [Example JSON of a scenario with object model data](scenarioo_object_model_example.js) 
 
## Open Points / To be defined

 * What characters should we allow in ID fields?
    * I think since it is a breaking release anyway, we can live with the fact that all old URLs will not be valid anymore on next release (or @adiherzog what do you think?)
       * therefore I propose to only allow characters that can be used without problems in URLs without encoding them for `id` fields.
        
 * To be consistent, also the usual objects should now get an `ìtems` field, shouldn't they?
       * No, I think this is not needed, because the existing explicit object types of scenarioo allready have explicit modeled sub items (useCase has scenarios, scenario has steps, etc.)
       
 * Do we allow to have properties without a `labelKey`? 
       * I propose not.
 
 * Do `labelKey` values have to be unique for one object? 
       * I propose yes.
 
 * Do we allow to have entries in `îtems` without a `labelKey`? 
       * I propose yes (data migration will become impossible otherwise).
 
 * Would numeric values and units be a good idea? see example for service call duration where building statistic could become interesting once.
       * Proposal: only introduce as soon as we need it
    
 * Should generic object items also have a field `labels` to add labels?
       * I think yes.
 
## Design Decissions

> Feel free to use this section to give feedback or discuss ... This is not finalized yet, it is just a draft of a proposal ...
> I try to summarize a little bit, why the current design is as it is and what arguments we discussed.
> Also I did not note all the arguments we discussed at the meeting, so feel free to add more arguments or more împortant things we decidced. Thank you!

1. What were the major architectural drivers for the new design?

    * new model should be more easy to understand and better documented
    * new model should be easy to be written from all technologies (JS, C#, Java, ...)
    * new model should solve the problem that we currently not can change the name (=display text for an object) without changing its identifier (which currently is the same)
    * also it should be possible again to store special characters like slashes again in this `name` or other fields (to be displayed), while URLs will use the ID fields 
      (which by default is generated from sanitizing the name fields, if not set explicitly and does not allow this problematic special characters)
 
2. Why do we not simply allow all kind of JSON objects directly to be attached as Details?
 
    > we discussed about this, but everybody invollved in the last meeting kind of agreed that this has many disadvantages, here some of the arguments ...

    * pure JSON model does not allow adding some meta data to each property. Some examples of Metadata we want to be able to store for each property:
        * properties can have a type (we could add features to style different types of properties or objects differently)
        * property items could have labels (same as in other scenarioo objects) on properties and objects?
        * not possible to distinguish between a usual property (`properties` in our model) and  a relationship (`items` in the proposed model)
 
    * order of properties fields should be guaranteed in all parsers used in all technologies 
        (and therefore using an array of explicit key-value pairs instead of json directly might be more save to keep the order)
 
    * in general we do not consider it good practice to just reserve some properties with special key words for such things 
        * probably not eaasy to make this explicit in Java or C# in the API while still allowing to pass arbitrary json objects
        * the user will not be able to use this keys for real documentation data property names anymore 
            (see `labelKey` in our new model instead, which can even contain `type`, `ìd`, `value` etc. as labels where appropriate)
         
    * Last but not least we not like the idea of allowing any json without restriction, because while this might be easy for JS-library, might not be sooo easy for C# and Java Library.
 
    * more arguments here?
 
## Change History

* 11.04.2016 First draft discussed with @tobiaszuercher @felixmokross @dola 
* 15.04.2016 @bruderol documented what we disucssed and reworked on the model to refine it to this first proposal here
    * I changed that instead of having two levels `{ key: 'bla', value: { value: 'blu', type: 'Service' } }` to simply using flat object items `{ labelKey: 'bla', value: 'blu', type: 'Service' }`
    * I changed names of some fields slightly and documented the example in more details
    * I documented an example object model in the example and created a nice model overview picture to explain it more easy
    * I tried to document all discussed arguments and important design decissions
    * the rest should still be as discussed, feel free to give feedback on issue #2 or directly contribute to this model by modifying this file here.
* 27.04.2016 presentation at the dev team meeting, the model is considered finalized, and will be implemented as described here
