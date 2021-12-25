window.isMapRegistered = false;
window.waitForElm = function (selector) {
    return new Promise((resolve) => {
        if (document.getElementById(selector)) {
            return resolve(document.getElementById(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.getElementById(selector)) {
                resolve(document.getElementById(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};

window.setupDatamaps = function (elem) {
    if (window.isMapRegistered === false) {
        window.isMapRegistered = !window.isMapRegistered;
        window.bubble_map = new Datamap({
            element: elem,
            scope: "india",
            responsive: false,
            height: "600px",
            geographyConfig: {
                popupOnHover: true,
                highlightOnHover: true,
                borderColor: "#444",
                borderWidth: 0.5,
                dataUrl: "/js/india.topo.json",
            },
            fills: {
                MAJOR: "#306596",
                MEDIUM: "#0fa0fa",
                MINOR: "#bada55",
                defaultFill: "#dddddd",
            },
            data: {
                JH: {
                    fillKey: "MINOR",
                },
                MH: {
                    fillKey: "MINOR",
                },
            },
            setProjection: function (element) {
                var projection = d3.geo
                    .mercator()
                    .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
                    .scale(1000);
                var path = d3.geo.path().projection(projection);
                return {
                    path: path,
                    projection: projection,
                };
            },
        });
    }
};
