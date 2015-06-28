# Event Calendar
Event Calendar - TypeScript plugin

Demo and documentation are published at http://marcelaulicna.github.io/event-calendar .

An event-calendar plugin provides simple and well-arranged calendar view with custom events and messages for user's colleagues or for himself. It shows all year calendar divided after months. Selecting dates is managed by clicking and dragging the day number on this schedule, after releasing the mouse button additional informations can be written in modal dialog. Plugin also supports connection to server, for example for saving events to database.

## How to install

#### 1. Install gulp
`npm install --global gulp`

#### 2. Install dependencies
`npm install`

#### 3. Build plugin
`gulp`

#### 4. Generate documentation
`gulp doc`

#### Optional commands
- Build plugin and definition file `event-calendar.d.ts`

  `gulp tsdef`

- Build plugin for development and add watches for `*.ts` and `*.less` files

  `gulp dev`

## Options
There is a brief list of plugin options. All properties are optional. For usage see particular examples in section [Usage](https://github.com/marcelaUlicna/event-calendar/blob/master/README.md#use-options).

- `events` - List of defined events to use in calendar
- `data` - json object that contains data for displaying then in calendar
- `locale` - Locale according to `momentjs` library, it is used for localization of month names and week days abbreviations
- `localization` - Object that contains custom labels for calendar modal dialog
- `editable` - Boolean, default true. Items in calendar can be added and deleted, both messages are visible on tooltip. If it is set to `false`, component is read-only and tooltip shows only user message.
- `moveAction` - typescript class or javascript function. Renders calendar for previous and next year. More info in [Calendar functions](https://github.com/marcelaUlicna/event-calendar/blob/master/README.md#calendar-functions) section.
- `submitData` - typescript class or javascript function. Selected data for submitting to server. More info in [Calendar functions](https://github.com/marcelaUlicna/event-calendar/blob/master/README.md#calendar-functions) section.
- `deleteData` - typescript class or javascript function. Selected data for deleting on server. More info in [Calendar functions](https://github.com/marcelaUlicna/event-calendar/blob/master/README.md#calendar-functions) section.


## Usage

1. Add css references:

   ```html
   <link href="dist/css/bootstrap.min.css" rel="stylesheet">
   <link href="dist/css/font-awesome.min.css" rel="stylesheet">
   <link href="dist/app/calendar.css" rel="stylesheet">
   ```
2. Add javascript references:

    ```html
    <script src="dist/js/jquery.min.js"></script>
    <script src="dist/js/bootstrap.min.js"></script>
    <script src="dist/js/moment-with-locales.min.js"></script>
    <script src="dist/app/event-calendar.js"></script>
    ```
    
#### Basic usage
Bellow is a minimal plugin initialization without options. It is fully functional client side component which contains one default event. You can choose the range of dates in calendar, fill both message and personal note in modal dialog and mark selected cell by clicking on `Submit` button or delete previously marked events.

```javascript
$("#calendar").eventCalendar();
```

#### Use options
In this example there are a few custom events. Object `events` contains five items where `name` property is required and properties `backgroundColor` and `color` are optional and define background and fore colors of specified cell in calendar. It can be in any of valid css color format.
```javascript
$("#calendar").eventCalendar({
    events: [
      {name: "Vacation", backgroundColor: "#5CB85C", color: "white"},
      {name: "Available", backgroundColor: "#5BC0DE"},
      {name: "Business trip", backgroundColor: "#EC971F"},
      {name: "Unavailable", backgroundColor: "#D9534F"},
      {name: "Other"}
    ]
});
```

#### Calendar data
Plugin accepts data in json format. It is convenient if you have saved some records in database and want them see in calendar. Data structure is following:
```json
[{
  "date": "2015/07/13",
  "event": "Vacation",
  "message": "Holiday in Spain",
  "note": null
},{
  "date": "2015/07/14",
  "event": "Available",
  "message": "Available for presentation and questions",
  "note": "Prepare business presentation"
}]
```

__Properties of a single object__

`date` - javascript Date object or valid date string which can be passed to `moment` function

`event` - event name which matches with `events` object in options. In case there is not event with given name, first event will be used instead for corresponding date in calendar

`message` - (optional) message for all users

`note` - (optional) note for himself

This is an example with data option:
```javascript
var calendarData = [{
    "date": "2015/07/13",
    "event": "Vacation",
    "message": "Holiday in Spain",
    "note": null
  },{
    "date": "2015/07/14",
    "event": "Available",
    "message": "Available for presentation and questions",
    "note": "Prepare business presentation"
}];

$("#calendar").eventCalendar({
    data: calendarData,
    events: [
      {name: "Vacation", backgroundColor: "#5CB85C", color: "white"},
      {name: "Available", backgroundColor: "#5BC0DE"},
      {name: "Business trip", backgroundColor: "#EC971F"},
      {name: "Unavailable", backgroundColor: "#D9534F"},
      {name: "Other"}
    ]
});
```

#### Calendar functions
Plugin has implemented three functions for server handling.

__moveAction__ function

This function provides rendering calendar for previous or next year. Plugin has implemented jquery promise and waits for callback. It can be implemented with javascript or typescript class.
- javascript:
  - `moveAction: function (year) {}`
  - example:
  
    ```javascript
    moveAction: function (year) {
        return $.ajax("/api/events/" + year)
          .done(function (result) {
             return result;
           })
          .fail(function (err) {
             return err;
          });
    }
    ```
- typescript:
  - extend class `MoveAction`
  - implement method `move(year: number, data?: Array<IData>): JQueryPromise<any>`
  - usage example: `moveAction: new Calendar.MyMoveAction()`


__submitData__ and __deleteData__ functions

Parameter contains array of `data` object. It can be implemented with javascript or typescript.
- javascript:
  - `submitData: function (params) {}`
  - `deleteData: function (params) {}`
  - single object in `params` has following properties:
      - date: Date
      - event: string
      - message: string
      - note: string
- typescript:
  - extend `PostDataAction`
  - implement method `process(data: Array<IData>): void`
  - usage example: `submitData: new Calendar.MySubmitMethod()`
  - usage example: `deleteData: new Calendar.MyDeleteMethod()`

#### Localization
Plugin supports localization utilizing `momentjs` library. See available locales on github https://github.com/moment/moment/tree/master/locale . To use locale, add property `locale` to options. If you want also localized calendar dialog, add another property `localization` with corresponding sentences. Both properties can be used independently so, for instance, default labels on calendar dialog can be overwritten with custom labels by using property `localization`.

```javascript
$("#calendar").eventCalendar({
    events: [
      {name: "Dovolená", backgroundColor: "#5CB85C", color: "white"},
      {name: "K dispozici", backgroundColor: "#5BC0DE"},
      {name: "Služební cesta", backgroundColor: "#EC971F"},
      {name: "Nedostupný", backgroundColor: "#D9534F"},
      {name: "Jiná událost"}
    ],
    locale: "cs",
    localization: {
      messageSentence: "Informace (uživatel uvidí tuto zprávu)",
      noteSentence: "Poznámka (pouze pro vás)",
      submitButton: "Odeslat",
      deleteButton: "Vymazat"
    }
});
```

#### Note
In `server` folder there is an example of saving data to database.
