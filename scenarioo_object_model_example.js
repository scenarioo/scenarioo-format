var exampleScenario = {

    name: 'the name of this scenario/can contain slashes but the id not',

    id: 'the_name_of_this_scenario_can_contain_slashes_but_the_id_not',

    description: 'Additional textual description',

    labels: ['happy', 'new-model-is-easy', 'new-model-is-cool'],

    status: "failed",

    properties: [

        /* Typical different kind of objects that could be stored here as attributes of this scenario */

        {
            /* Simple String value */
            labelKey: "simpleStringValue",
            value: "a textual information"
        },

        {
            /* Former ObjectDescription: for structured information and typed objects (which have an id and are indexed and searchable) */
            labelKey: "exception",
            value: "Scenario failed: Element not found",
            type: "Exception",
            id: "ElementNotFoundException",  // optional, otherwise generated form value
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
                    value: "at new bot.Error (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/atoms/error.js:108:18)\n"
                    + "at /usr/local/lib/node_modules/protractor/lib/element.js:674:15\n"
                    + "at [object Object].promise.Promise.goog.defineClass.invokeCallback_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/goog/../webdriver/promise.js:1337:14)\n"
                    + "...\n"
                    + "From asynchronous test:\n"
                    + "at Suite.<anonymous> (/var/lib/jenkins/jobs/your-app-e2e-tests/workspace/e2e-tests/specs/artists/create.spec.js:21:5)\n"
                    +  "..."
                }
                /* can of course have more complex properties again */
            ]
        },

        {
            /* Former ObjectReference: to simply display an object without all its values (stored in other place) */
            labelKey: "issueReference",
            value: "#128 more easier object references",
            type: "Issue",
            id: "128"  // optional if the sanitized value is used as ID
        },

        {
            /* Former ObjectList: list structures in documentation */
            labelKey: "aListOfItems",
            items: [
                {
                    labelKey: "1", // can (optionaly) be used for numbered lists !
                    value: "a numbered list item with an index displayed in front"
                    // can contain same fields again
                },
                {
                    value: "A simple list item without index, for simple bullet list"
                    // of course list items could again contain more complex value types and all other proerties, as in other places
                }
            ]
        },

        {
            /* Former ObjectTreeNode: tree structures like component call trees */
            labelKey: "uiController",
            value: "myMusicSearchScreen",
            type: "UiController",
            properties: [
                {
                    labelKey: "description",
                    value: "Controller of my music search page, could be an angular controller"
                },
                {
                    labelKey: "searchText",
                    value: "U2"
                },
                {
                    labelKey: "type",
                    value: "DirectiveController",
                    type: "ControllerType"
                }
            ],
            items: [
                {
                    value: "searchCategoriesService",
                    type: "Service",
                    properties: [
                        {
                            labelKey: "description",
                            value: "Get the search categories for search filtering"
                        },
                        {
                            // Kind of an enum
                            labelKey: "type",
                            type: "ServiceType",
                            value: "WebService"
                        },
                        {
                            labelKey: "version",
                            value: "1.5"
                        },
                        {
                            /**
                             * Following is an example for a property, that will have different values for the same object,
                             * because the same service can be called more than once but will have different durations.
                             * Server could detect that, and display all available values of all occurences on the service overview page.
                             * (that was a great idea by @dola to make the model more simpler - kudos to @dola ! :+1: )
                             */
                            labelKey: "callDuration",
                            value: "21 ms"
                        }
                    ],
                    items: [
                        // service can also have children:
                        // e.g. other components triggered by this service (e.g. DB, Filesystem, ...)
                    ]
                },
                {
                    value: "myMusicSearchService",
                    type: "Service",
                    properties: [
                        {
                            labelKey: "description",
                            value: "An example music search service called from the UI controller"
                        },
                        {
                            // Kind of an enum
                            labelKey: "type",
                            type: "ServiceType",
                            value: "WebService"
                        },
                        {
                            labelKey: "version",
                            value: "1.0.1"
                        },
                        {
                            labelKey: "callDuration",
                            value: "01:53 min"
                        }
                    ],
                    items: [
                        // service can also have children:
                        // e.g. other components triggered by this service (e.g. DB, Filesystem, ...)
                    ]
                }

            ]

        },

        {
            // NEW: why not also give possibility to add labels to values and objects?
            labelKey: "aLabeledObject",
            value: "E.g. a service with special service categories or tags as labels",
            type: "Service",
            labels: ["WebService", "unstable"]
        }

    ]

};
