var exampleScenario = {

    name: 'the name of this scenario/can contain slashes but the id not',
    id: 'the_name_of_this_scenario_can_contain_slashes_but_the_id_not',
    description: 'Additional textual description',

    /**
     * Properties:
     * A list containing generic DetailItem objects each describing a property of this object.
     * Basically a list of key value pairs (labelKey and value).
     *
     * DetailItem:
     * the entries stored in the `properties` list of another object
     * OR other objects
     *
     * This is the new Scenarioo meta model for describing arbitrary documentation data (as properties of objects or standalone objects again, with relations to each other).
     * You can think of a DetailItem like either an Attribute (for properties of an object) or an object itself (for other more complex related items) in an UML object model.
     *
     * The following examples show the different possibilities of DetailItem that can be stored in `properties` (and as well in `ìtems`, see later)
     *
     * What the different fields of `DetailItem` mean (in analogy to UML object models):
     *  * labelKey = this is the key of the property (=the attribute), or for `ìtems` (see later) it is the optional relationship name
     *  * value = value of the attribute, in display format (may contain special characters), or for `ìtems` (= again an object in the diagram) it is the name of the box
     *  * type = type of the property or the object item (for complex object values that represent a special type of object)
     *  * id = special unique identifier for typed objects (used for references to this same object value and will be used in URLs to it)
     *  * properties: attributes of the object (= such DetailItems again), used to model simple properties of an object.
     *  * items: relationships of the object to other objects (= DetailItems again), for more complex data structures e.g. a list of bullet items, or numbered items or even a tree structure (with children)
     *
     * You could also think of a DetailItem like cells or columns in a table:
     *  * labelKey = key & caption of the column
     *  * value = value of the cell (in display format)
     *  * type = type of the cell (for complex object values that represent a special type of object)
     *  * id = special unique identifier for typed objects stored in a cell (can be used for references to this same complex value and will be used in URLs to it)
     *  * properties: if the value stored in that cell is more complex, it can contain kind of sub columns (or properties) = more DetailItems
     *  * items: if the value is a even more complex data structure it can contain relationships to other objects (e.g. a list of bullet items, or numbered item lists or even a tree structure (with recursive child items))
     *
     * If the distinction between properties and items is not clear:
     * It is similar to attributes/fields versus references/associations in the UML model
     * (in the end both have same power, but the visualization is different!)
     *
     * AND since a picture says more than tousand words ...
     * see new_sceanrioo_detail_item_model_compared_to_uml.png
     */
    properties: [

        {

            /**
             *  Example for structure of such detail items:
             */

            labelKey: "(optional but recommended for `properties`, or even required inside properties?? But optional in `items`. Should be unique on same object) " +
            "the key of the property that this detail item describes of the object it belongs to. will be displayed as field name." +
            "can be used for configuration purpose, e.g. to select some special property values to display in some special views e.g. as table columns." +
            "this does not belong to the information value object, meaning, that same object value, even typed value, can occur with multiple different property keys of course",

            value: "(optional) the value of the object to display, is also the display text or name of this object to be displayed for this object. Should be a unique identifier for all objects of same type.",

            type: "(optional) a type identifier to group different type of objects, examples: UiElement|PageObject|Service|Feature|Story|... Whatever types make sense to be defined in your application." +
            "Scenario Viewer can display typed objects in additional search tabs, to see all objects of one or several types in one view to easily search for them.",

            id: "(only for generic object's having a type field or as well for other typed concrete scenarioo objects) " +
            "A unique identifier for this typed object that is not allowed to contain some special characters (/, \)." +
            "If not set explicitly the libraries will calculate this identifier for you from the object's value by sanitizing unallowed characters. " +
            "This ID will not be displayed but will be used in URLs and internaly for identification and comparison of objects and for storing the objects. " +
            "It is recommended to keep this field unchanged for object's when they change their value (=display text), to keep trackable how this documented objects evolve between different builds.",

            /**
             * Properties:
             * The fields that decscribe properties of this object as key-value-pairs
             * Since an object can occur more than once, it is allowed that some properties change between multiple occurences of the same object
             * It is also allowed to store the same object only with partial properties in some places (to avoid redundancy)
             * The object overview page will display all the properties of an object that were stored in some place and show the one (or potentialy several values) a value had assigned for a property
             **/
            properties: [

                {
                    /* Simple String value */
                    labelKey: "simpleStringValue",
                    value: "a textual information"
                },

                {
                    /* Former ObjectDescription */
                    labelKey: "service1",
                    type: "ServiceCall",
                    value: "Displayable name of the Service",
                    id: "ServiceA", // unique identifier for this service call, without special characters and kept if display name (=value) changes.
                    properties: [
                        {
                            labelKey: "someProperty",
                            value: "some value"
                        },
                        // can also again have more complex properties
                    ]
                },

                {
                    /* Former ObjectReference */
                    labelKey: "serviceRef",
                    type: "ServiceCall",
                    id: "ServiceA"
                },


                {
                    /* Former ObjectList */
                    labelKey: "orderedList",
                    items: [
                        {
                            labelKey: "1", // can (optionaly) be used for numbered lists !
                            value: "an item"
                            // DetailItem (same again)
                        },
                        {
                            // DetailItem (same again)
                        },
                    ]
                },

                {
                    /* Former ObjectTreeNode */
                    labelKey: "aTreeStructure",
                    value: "Tibco.searchCustomer",
                    type: "service",
                    properties: [
                        {
                            labelKey: 'eaName',
                            value: "name in EA model"
                        },
                        {
                            /**
                             * Example for a property, that will probably have different values for the same object,
                             * because the same service can be called more than once but will have different durations.
                             *
                             * TODO Idea:
                             * Maybe that is an example where units and numeric values would make sense to build statistics on such properties??
                             */
                            labelKey: "callDuration",
                            value: "12 ms"
                        }
                    ],
                    items: [
                        {
                            value: "AnotherWebService1.TriggeredByParent",
                            type: "service",
                            properties: {}
                        },
                        {
                            value: "AnotherWebService2.TriggeredByParent",
                            type: "service",
                            properties: {}
                        }
                    ]
                }

            ],

            items: [
                /* sub items for tree structures or lists */
                /* the difference between properties and items is probably only a different visualization, apart fromt that they can contain same kind of items again, allthough `propertyKey` makes less sense except for numbered items maybe **/

                /* idea: would it be helpful to also display all the sub items of an object on the object overview page, currently that featutre is missing --> open additional issue! **/
            ],

            /** maybe later **/
            labels: ['object-label', 'be-happy'] // objects should also have labels

        }]
};