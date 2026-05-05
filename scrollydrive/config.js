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
            location: { center: [-76.4895, 38.9775], zoom: 15, pitch: 0, bearing: 0 },
            onChapterEnter: [],
            onChapterExit: []
        },
        { id: 'drive-slide-0', title: '', image: '', description: '',
          location: { center: [-76.4898, 38.9794], zoom: 16, pitch: 30, bearing: 0 },
          onChapterEnter: [], onChapterExit: [] },
        { id: 'drive-slide-1', title: '', image: '', description: '',
          location: { center: [-76.4921, 38.9784], zoom: 16, pitch: 30, bearing: 0 },
          onChapterEnter: [], onChapterExit: [] },
        { id: 'drive-slide-2', title: '', image: '', description: '',
          location: { center: [-76.4863, 38.9769], zoom: 16, pitch: 30, bearing: 0 },
          onChapterEnter: [], onChapterExit: [] },
        { id: 'drive-slide-3', title: '', image: '', description: '',
          location: { center: [-76.4822, 38.9716], zoom: 16, pitch: 30, bearing: 0 },
          onChapterEnter: [], onChapterExit: [] },
        { id: 'drive-slide-4', title: '', image: '', description: '',
          location: { center: [-76.4816, 38.9720], zoom: 16, pitch: 30, bearing: 0 },
          onChapterEnter: [], onChapterExit: [] }
    ]
};
