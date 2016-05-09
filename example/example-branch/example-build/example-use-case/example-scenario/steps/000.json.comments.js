/**
 * Example step files with some developer comments.
 */

var step = {


    index: 0,

    id: "", // optional to overrule the usual URL schema for steps which is "{pageName}/{pageOccurenceId}/{stepInPageIndex}", with id set a step is available under "{stepId}"

    title: "Test Step", // optional

    status: "success", // optional, free text field, but "success" and "failed" are default keywords for states interpreted as successful and failed, all other states are treated as unknwon or undefined and visualized orange-warnign-style (case sensitive!) [default "failed" and "success" states can be configured in config somehow, but seems to be not considered everywhere in the webapp --> TODO: remove configuration!]

    // screenshotFileName is inferred from index (000.png). Lookup is based on supported image types: png, jpeg, jpg, gif, bmp

    page: { // optional
        name: "example/page.html", // mandatory
        id: "example-page-html",
        properties: [], // TODO: define if this is a properties list or additional sections
        // is this shown in a separate section or is it possible to define new sections here?
        labels: ["page-label-1"]
    },

    visibleText: "just some dummy html code", // visible page text used for full-text search
    // html code is in a separate file (../html/[].html

    screenAnnotations: [
        // No changes to existing format (except rename details -> properties)
        // TODO: add real examples
        {
            style: "CLICK",
            clickAction: "TO_NEXT_STEP", // enum: TO_URL, ...
            region: {
                x: 0,
                y: 0,
                width: 200,
                height: 100
            },
            properties: []
        },
        {
            style: "CLICK",
            clickAction: "TO_URL",
            clickActionUrl: "http://blabla.com/blubbi",
            region: {
                x: 0,
                y: 0,
                width: 200,
                height: 100
            },
            properties: []
        }
    ],

    labels: ["example-step-label1", "example-step-label-2"],

    properties: [
        {
            labelKey: "url",
            value: "http://..."
        }
    ],

    propertyGroups: [ // for additional propoerties that are grouped in property sections, each with a label name
        {
            labelKey: "Service Calls",
            properties: []
        }
    ],

};