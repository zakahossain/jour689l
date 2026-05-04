// Number of slides that will drive (one for each restaurant = 5)
var driveSlides = 5;

// Number of points on drive route (more = higher quality, but slower to process)
var driveSmoothness = 200;

// Value used to drive
var driveTime = driveSlides*driveSmoothness;

// Do you want to follow the point? True = follow
var followPoint = true;

// ...If so, what zoom, pitch, and bearing should be used to follow?
var followZoomLevel = 16;
var followBearing = 0;
var followPitch = 30;

var config = {
    style: 'mapbox://styles/mapbox/light-v11',
    accessToken: 'pk.eyJ1IjoiemFrYWhvc3NhaW4iLCJhIjoiY21vOWo2ODNpMGE1YjJxb21sYTZpMDg0eCJ9.I06SXuT3FOqYCPTpo7m1hA',
    showMarkers: false,
    markerColor: '#3FB1CE',
    googlePlacesKey: 'AIzaSyBkCmVeMxl2zNBsCkTDQWbhX4QRw8fJKjU',
    theme: 'light',
    alignment: 'left',
    title: 'Annapolis Lobbying Venues',
    subtitle: 'Where influence happens over dinner',
    byline: 'An investigation into Maryland campaign finance',
    footer: 'Data from Maryland State Board of Elections. Restaurants identified as frequent venues for lobbyist dinners near the State Capitol.',
    chapters: [
        {
            id: 'intro',
            title: 'Follow the Money',
            image: '',
            description: 'Maryland lobbyists host dinners at five upscale restaurants within walking distance of the State House. As you scroll, watch the routes from the Capitol to each venue.',
            location: {
                center: [-76.4895, 38.9775],
                zoom: 15,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'drive-slide-0',
            title: 'Harry Browne\'s Restaurant',
            image: '',
            description: 'Located directly across from the Maryland State House at 66 State Circle. Its position makes it a natural gathering spot for pre-dinner political meetings. Fine dining atmosphere with upstairs bar.',
            location: {
                center: [-76.4898, 38.9794],
                zoom: 16,
                pitch: 30,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'route-0',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'route-0',
                    opacity: 0
                }
            ]
        },
        {
            id: 'drive-slide-1',
            title: 'Acqua al 2',
            image: '',
            description: 'Italian fine dining on Main Street with excellent service. Known for private dining rooms—ideal for confidential group dinners where lobbyists coordinate strategy.',
            location: {
                center: [-76.4921, 38.9784],
                zoom: 16,
                pitch: 30,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'route-1',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'route-1',
                    opacity: 0
                }
            ]
        },
        {
            id: 'drive-slide-2',
            title: 'The Choptank',
            image: '',
            description: 'Waterfront seafood venue on Annapolis Harbor with generous seating capacity. Popular for hosting group dinners—team leaders often announce annual dinners here.',
            location: {
                center: [-76.4863, 38.9769],
                zoom: 16,
                pitch: 30,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'route-2',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'route-2',
                    opacity: 0
                }
            ]
        },
        {
            id: 'drive-slide-3',
            title: 'Lewnes\' Steakhouse',
            image: '',
            description: 'Highest-rated venue (4.8★) with classic fine dining atmosphere. Multiple private rooms enable confidential meetings. Old-school elegant without being stuffy.',
            location: {
                center: [-76.4822, 38.9716],
                zoom: 16,
                pitch: 30,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'route-3',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'route-3',
                    opacity: 0
                }
            ]
        },
        {
            id: 'drive-slide-4',
            title: 'Ruth\'s Chris Steak House',
            image: '',
            description: 'Premium steakhouse known for consistent high-end experience and signature sizzling plates. Upscale atmosphere suited to influence-building dinners.',
            location: {
                center: [-76.4816, 38.9720],
                zoom: 16,
                pitch: 30,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'route-4',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'route-4',
                    opacity: 0
                }
            ]
        }
    ]
};
