# Scenarioo DocuObject Model

The Scenarioo DocuObject Model allows to add arbitrary application-specific documentation data to any object in the scenarioo model.

Each object in the scenario model has a property `properties` (similar to `details` in scenarioo 2.x model) that can be used to attach additional data attributes to an object.
This `properties` basically is an array of entries (with `labelKey`, `value` and optionally some more meta data information) explained in more details in following sections.

Inside such properties you can even store more complex objects of complex data structure, that have a `type` and  which can again contain `properties`. 

Similar to all scenarioo's explicit object types (useCase, scenario, step, page, ...) also your own application-specific type of objects can contain again sub items in an optional field called `items`.
Using `items` you can model objects who contain again a list of sub objects, the same as e.g. a useCase in the scenarioo domain model, that has scenarios as sub items.

## Model Overview

Two pictures say more than tousand words:

![Scenarioo Docu Object Model](images/draw.io/scenarioo_docu_object_model_overview.png)

The first picture above demonstrates how `DocuObject` objects can get attached to different kind of scenarioo docu model entities, either as `properties`(for all entities), or also as `sections` (only for most important entities, like use case, scenario and step).

The following picture demonstrates an example object hierarchy of 5 DocuObjects to demonstrate how this model can be used to model arbitrary application specific documentation data object structures:

![Scenarioo Object Model Example](images/draw.io/scenarioo_docu_object_model_example.png)
 
This example UML Object Diagram demonstrates how all elements of an UML object diagram could be modeled in the new Scenarioo Model: 
See annotations in color with mapping the elements to the scenarioo DocuObject model.

This means that any UML object model could be kind of stored using the Scenarioo DocuObject Model.

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
 * `items` are related items or hierarchical sub items (e.g. like a use case has several scenarios and a scenario has several steps). Those are used to model lists or even trees of values or objects.
 * It is similar to attributes/fields (=`properties`) versus references/associations (=`items`) in the UML model
 * Both have same power concerning what data can be modeled/stored inside, but the visualization (where you see what) will be different

## Model Documentation

Each entry in a `properties` or `items` array is a object of type `DocuObject` that can have the properties as described in details under [DocuObject](README.md#DocuObject)
  
## Example

**Specification by Example:**

The following extensive example demonstrates how this model can be used to add concrete different kind of application-specific data to a scenario in your scenarioo documentation.
(same is of course also possible on a branch, build, useCase, step, and page)
 
See [Example JSON of a scenario with object model data](scenarioo_object_model_example.js)
 
## Design Decisions

> this section tries to summarize a little bit, why the current design is as it is and what arguments we discussed.
> We did not note all the arguments we discussed at the meetings, so feel free to add more arguments or more important things we decided, in case you remember. Thank you!

1. What were the major architectural drivers for the new design?

    * new model should be more easy to understand and better documented
    * new model should be easy to be written from all technologies (JS, C#, Java, ...)
    * new model should solve the problem that we currently not can change the name (=display text for an object) without changing its identifier (which currently is the same)
    * also it should be possible again to store special characters like slashes again in this `name` or other fields (to be displayed), while URLs will use the ID fields 
      (which by default is generated from sanitizing the name fields, if not set explicitly and does not allow this problematic special characters)
 
2. Why do we not simply allow all kind of JSON objects directly to be attached as Details?
 
    > we discussed about this, but everybody involved in the last meeting kind of agreed that this has many disadvantages, here some of the arguments ...

    * pure JSON model does not allow adding some meta data to each property. Some examples of Metadata we want to be able to store for each property:
        * properties can have a type (we could add features to style different types of properties or objects differently)
        * property items could have labels (same as in other scenarioo objects) on properties and objects?
        * not possible to distinguish between a usual property (`properties` in our model) and  a relationship (`items` in the proposed model)
 
    * order of properties fields should be guaranteed in all parsers used in all technologies 
        (and therefore using an array of explicit key-value pairs instead of json directly might be more save to keep the order)
 
    * in general we do not consider it good practice to just reserve some properties with special key words for such things 
        * probably not easy to make this explicit in Java or C# in the API while still allowing to pass arbitrary json objects
        * the user will not be able to use this keys for real documentation data property names anymore 
            (see `labelKey` in our new model instead, which can even contain `type`, `ìd`, `value` etc. as labels where appropriate)
         
    * Last but not least we not like the idea of allowing any json without restriction, because while this might be easy for JS-library, might not be so easy for C# and Java Library.
 
    * more arguments here?

3. Some minor points discussed and decided about for the new format:

 * What characters should we allow in ID fields?
    * Since it is a breaking release anyway, we can live with the fact that all old URLs will not be valid anymore on next release
       * Therefore we will only allow characters that can be used without problems in URLs without encoding them for `id` fields: A-Za-z0-9-_ that's it.
       * all other characters will have to be sanitized by the libraries somehow (to be defined).
       * To still support all old URLs, we could introduce a redirect filter for those requests where illegal characters are in the requests

 * To be consistent, also the usual objects should now get an `ìtems` field, shouldn't they?
    * No, not needed, because the existing explicit object types of scenarioo already have explicit modeled sub items (useCase has scenarios, scenario has steps, etc.)

 * Do we allow to have properties without a `labelKey`?
     * No
     * But items can have objects without `labelKey`.

 * Do `labelKey` values have to be unique for one object?
    * Yes, they should (if not, it will work anyway, but referencing an object through the label key will take anyone).

 * Do we allow to have entries in `îtems` without a `labelKey`?
    * Yes (data migration will become impossible otherwise).

 * Would numeric values and units be a good idea? see example for service call duration where building statistic could become interesting once.
    * For now not, we could introduce it, if we really need it

 * Should generic object items also have a field `labels` to add labels?
    * We might add that later, for now not (because client does not yet support it)
    * Same for build and branch



## Change History

* 11.04.2016 First draft discussed with @tobiaszuercher @felixmokross @dola 
* 15.04.2016 @bruderol documented what we discussed and reworked on the model to refine it to this first proposal here
    * I changed that instead of having two levels `{ key: 'bla', value: { value: 'blu', type: 'Service' } }` to simply using flat object items `{ labelKey: 'bla', value: 'blu', type: 'Service' }`
    * I changed names of some fields slightly and documented the example in more details
    * I documented an example object model in the example and created a nice model overview picture to explain it more easy
    * I tried to document all discussed arguments and important design decisions
    * the rest should still be as discussed, feel free to give feedback on issue #2 or directly contribute to this model by modifying this file here.
* 27.04.2016 @bruderol presented the design at the dev team meeting, the model is considered finalized, and will be implemented as described here
* 09.05.2016 @bruderol cleaned up this docu page, according our further discussions. Model is considered more or less finalized.
* 21.05.2016 @bruderol improved and finalized documentation for final format 3.0 docu, added a picture, cleaned up open points.
